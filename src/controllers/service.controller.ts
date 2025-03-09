import { Request, Response } from "express";
import { ServiceModel } from "../models/service.model";
import { CustomerModel } from "../models/customer.model";
import { UserModel } from "../models/user.model";
import moment from "moment";

const getServices = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const page = parseInt(filters.page as string) || 1;
    const limit = parseInt(filters.limit as string) || 10;
    const skip = (page - 1) * limit;
    let $and: any[] = [];

    if (filters.keyword) {
      const keyword = new RegExp(filters.keyword as string, "i");
      const customers = await CustomerModel.find({
        $or: [
          { name: { $regex: keyword } },
          { lastName: { $regex: keyword } },
          { middleName: { $regex: keyword } },
          { email: { $regex: keyword } },
        ],
      })
        .select("_id")
        .lean();
      const customerIds = customers.map((customer) => customer._id);

      const users = await UserModel.find({
        $or: [{ name: { $regex: keyword } }, { email: { $regex: keyword } }],
      })
        .select("_id")
        .lean();
      const userIds = users.map((user) => user._id);

      $and.push({
        $or: [
          { customerId: { $in: customerIds } },
          { createdBy: { $in: userIds } },
          { serviceType: { $regex: keyword } },
          { meterNumber: { $regex: keyword } },
          { street: { $regex: keyword } },
          { number: { $regex: keyword } },
          { neighborhood: { $regex: keyword } },
          { city: { $regex: keyword } },
          { state: { $regex: keyword } },
        ],
      });
    }

    // Additional filters
    if (filters.createdByEmail) {
      const regex = new RegExp(filters.createdByEmail as string, "i");
      const users = await UserModel.find({ email: { $regex: regex } })
        .select("_id")
        .lean();
      const userIds = users.map((user) => user._id);
      $and.push({ createdBy: { $in: userIds } });
    }

    if (filters.serviceType) {
      $and.push({ serviceType: filters.serviceType });
    }

    if (filters.startDate && filters.endDate) {
      const startDate = moment(filters.startDate as string)
        .startOf("day")
        .toDate();
      const endDate = moment(filters.endDate as string)
        .endOf("day")
        .toDate();
      $and.push({ createdAt: { $gte: startDate, $lte: endDate } });
    }

    const isMobile = filters.mobile === "true";
    const isHideMeterless = filters.meterless === "true" ? true : false;

    if (isMobile || isHideMeterless) {
      $and.push({ meterNumber: { $exists: true, $ne: "" } });
    }

    const query = $and.length > 0 ? { $and } : {};

    const [totalServices, services] = await Promise.all([
      ServiceModel.countDocuments(query),
      ServiceModel.find(query)
        .skip(skip)
        .limit(limit)
        .select(
          "createdBy customerId serviceType meterNumber street number neighborhood city state records createdAt"
        ) // Projection
        .populate({ path: "createdBy", select: "name email periodId" })
        .populate({
          path: "customerId",
          select: "externalContractId name lastName middleName email",
        })
        .populate({
          path: "records",
          select: "currentRecord periodId createdAt",
          options: {
            sort: { createdAt: -1 },
            limit: 1,
          },
          populate: {
            path: "periodId",
            select: "name fecha_inicio fecha_fin",
            model: "Period",
          },
        }),
    ]);

    const processedServices = services.map((service: any) => {
      const serviceObj = service.toObject();

      const lastRecord =
        serviceObj.records.length > 0
          ? {
              period: serviceObj.records[0].periodId,
              currentRecord: serviceObj.records[0].currentRecord,
              createdAt: serviceObj.records[0].createdAt,
            }
          : null;

      const { records, ...rest } = serviceObj;
      return { ...rest, lastRecord };
    });

    const totalPages = Math.ceil(totalServices / limit);
    const pagination = {
      total: totalServices,
      totalPages,
      totalNow: processedServices.length,
    };
    res.json({
      pagination,
      data: processedServices,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getService = (req: Request, res: Response) => {
  const { id } = req.params;
  ServiceModel.findById(id)
    .populate({ path: "createdBy", select: "name" })
    .populate("customerId")
    .populate({
      path: "charges",
      select: "name amount",
    })
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Service not found" });
      res.json(rs);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const createService = (req: Request, res: Response) => {
  const {
    customerId,
    meterNumber,
    serviceType,
    number,
    street,
    neighborhood,
    city,
    state,
  } = req.body;
  const createdBy = req.uid;
  if (!customerId) {
    return res
      .status(403)
      .json({ error: 11001, message: "customerId can't be empty" });
  }

  const service = new ServiceModel({
    customerId,
    meterNumber,
    serviceType,
    number,
    street,
    neighborhood,
    city,
    state,
    createdBy,
  });
  service
    .save()
    .then((rs) => {
      CustomerModel.findByIdAndUpdate(
        { _id: customerId },
        { $push: { services: rs._id } }, // Añade el ID del servicio al array de servicios de Customer
        { new: true } // Devuelve el documento de Customer actualizado
      )
        .populate("services") // Incluye los detalles de los servicios en el documento de Customer
        .then((customer) => {
          res.status(201).json(customer);
        });
    })
    .catch((e) => {
      if (e.code == 11000) {
        return res
          .status(403)
          .json({ error: 11000, message: "Water meter id duplicated" });
      }
      res.status(403).json(e);
    });
};

const updateService = (req: Request, res: Response) => {
  const { id } = req.params;
  const { customerId, meterNumber, status, serviceType, charges } = req.body;

  ServiceModel.findByIdAndUpdate(
    { _id: id },
    { customerId, meterNumber, status, serviceType, charges },
    { new: true }
  )
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Service not found" });
      res.status(201).json({ updated: true, service: rs });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const disableService = (req: Request, res: Response) => {
  const { id } = req.params;
  ServiceModel.findByIdAndUpdate({ _id: id }, { status: 0 })
    .then((rs) => {
      res.status(201).json({ disabled: true });
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

const getRecordsByService = (req: Request, res: Response) => {
  ServiceModel.aggregate([
    {
      $lookup: {
        from: "records", // Nombre de la colección de Record en MongoDB
        localField: "_id",
        foreignField: "serviceId",
        as: "records",
      },
    },
  ])
    .exec()
    .then((services) => {
      console.log(services);
    })
    .catch((error) => {
      console.log(error);
    });
};

export {
  getServices,
  getService,
  createService,
  updateService,
  disableService,
  getRecordsByService,
};
