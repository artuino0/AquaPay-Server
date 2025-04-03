import { Request, Response } from "express";
import { BillModel } from "../models/bill.model";
import { ServiceModel } from "../models/service.model";
import { PeriodModel } from "../models/period.model";
import { RecordModel } from "../models/record.model";
import { TariffTableModel } from "../models/tariffTable.model";
import { ChargeModel } from "../models/charge.model";
import { SettingsModel } from "../models/settings.model";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import puppeteer from "puppeteer";
import { BankAccountModel } from "../models/bankaccount.model";

export class BillController {
  // Usar funciones flecha para los métodos
  private getChargesWOMeter = async () => {
    return await ChargeModel.find({
      active: true,
      general: true,
      applyWOMeter: true,
      special: false,
    }).lean();
  };

  private getGeneralCharges = async () => {
    return await ChargeModel.find({
      active: true,
      general: true,
      applyWOMeter: false,
      special: false,
    });
  };

  private getSpecialCharges = async () => {
    // Implementación si es necesario
  };

  private getConsumptionRate = async () => {
    // Implementación si es necesario
  };

  private getAdditionalCharges = async () => {
    // Implementación si es necesario
  };

  public downloadPdf = async (req: Request, res: Response) => {
    try {
      const { billId } = req.params;

      const bill = await BillModel.findById(billId)
        .populate("customerId")
        .populate("serviceId")
        .populate("periodId")
        .lean();

      if (!bill) {
        return res.status(404).json({
          ok: false,
          message: "Factura no encontrada",
        });
      }

      const logoPath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "logo_company.png"
      );
      const logoBuffer = fs.readFileSync(logoPath);
      const logoBase64 = `data:image/png;base64,${Buffer.from(
        logoBuffer
      ).toString("base64")}`;

      const settings = await SettingsModel.findOne();
      if (!settings) {
        return res.status(404).json({
          ok: false,
          message: "No se encontró la configuración de la empresa",
        });
      }

      const bankAccounts = await BankAccountModel.find().limit(2).lean();

      const templateData = {
        logoBase64,
        companyName: settings.companyName,
        companyAddress: settings.address,
        companyNeighborhood: settings.downtown,
        companyCityState: settings.city_state,
        companyPhone: settings.phone,
        companyMobile: settings.cellphone,
        bankAccounts: bankAccounts.map((account) => ({
          name: account.name,
          clabe: account.clabe,
          cuenta: account.accountNumber,
        })),
        customers: [
          {
            customerName: `${(bill.customerId as any).name} ${
              (bill.customerId as any).middleName
            } ${(bill.customerId as any).lastName}`,
            customerStreet: (bill.serviceId as any).street,
            customerAddress: (bill.serviceId as any).number,
            lotNumber: "N/A",
            meterNumber:
              (bill.serviceId as any).meterNumber == ""
                ? "S/MEDIDOR"
                : (bill.serviceId as any).meterNumber,
            contractNumber: (bill.customerId as any).externalContractId,
            totalAmount: bill.totalAmount.toFixed(2),
            dueDate: new Date(bill.dueDate).toISOString().split("T")[0],
            previousReading: bill.previousReading.toString(),
            currentReading: bill.currentReading.toString(),
            charges: bill.charges,
            consumption: bill.consumption.toString(),
            previousDebt: bill.previousDebt.toFixed(2),
            payment: bill.payment.toFixed(2),
            consumptionAmount: bill.consumptionAmount.toFixed(2),
            baseRate: bill.baseRate.toFixed(2),
            surcharges: bill.surcharges.toFixed(2),
            discount: bill.discount.toFixed(2),
          },
          {
            customerName: `${(bill.customerId as any).name} ${
              (bill.customerId as any).middleName
            } ${(bill.customerId as any).lastName}`,
            customerStreet: (bill.serviceId as any).street,
            customerAddress: (bill.serviceId as any).number,
            lotNumber: "N/A",
            meterNumber:
              (bill.serviceId as any).meterNumber == ""
                ? "S/MEDIDOR"
                : (bill.serviceId as any).meterNumber,
            contractNumber: (bill.customerId as any).externalContractId,
            totalAmount: bill.totalAmount.toFixed(2),
            dueDate: new Date(bill.dueDate).toISOString().split("T")[0],
            previousReading: bill.previousReading.toString(),
            currentReading: bill.currentReading.toString(),
            charges: bill.charges,
            consumption: bill.consumption.toString(),
            previousDebt: bill.previousDebt.toFixed(2),
            payment: bill.payment.toFixed(2),
            consumptionAmount: bill.consumptionAmount.toFixed(2),
            baseRate: bill.baseRate.toFixed(2),
            surcharges: bill.surcharges.toFixed(2),
            discount: bill.discount.toFixed(2),
          },
        ],
      };

      // Leer la plantilla
      const templatePath = path.join(
        __dirname,
        "..",
        "templates",
        "billing.template.html"
      );
      const templateHtml = fs.readFileSync(templatePath, "utf-8");

      // Compilar la plantilla
      const template = handlebars.compile(templateHtml);
      const html = template(templateData);

      // Generar PDF
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({
        format: "letter",
        landscape: true,
        printBackground: true,
        margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
      });
      await browser.close();

      // Enviar el PDF como respuesta
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Length", pdfBuffer.length);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="factura-${billId}.pdf"`
      );
      res.status(200).end(pdfBuffer);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      res.status(500).json({
        ok: false,
        message: "Error al generar el PDF",
      });
    }
  };

  public generateBillForService = async (req: Request, res: Response) => {
    try {
      const { serviceId } = req.params;

      const service = await ServiceModel.findById(serviceId);
      if (!service) {
        return res.status(404).json({
          ok: false,
          message: "Servicio no encontrado",
        });
      }

      const activePeriod = await PeriodModel.findOne({
        active: true,
      });

      if (!activePeriod) {
        return res.status(400).json({
          ok: false,
          message: "No hay un periodo activo",
        });
      }

      const existingBill = await BillModel.findOne({
        serviceId,
        periodId: activePeriod._id,
      });

      if (existingBill) {
        return res.status(400).json({
          ok: false,
          message:
            "Ya existe un recibo para este servicio en el periodo actual",
        });
      }

      let currentRecord = null;
      let chargesWOMeter: any[] = [];

      if (!service.meterNumber || service.meterNumber === "") {
        console.log("No tiene medidor");
        chargesWOMeter = await this.getChargesWOMeter();
      } else {
        currentRecord = await RecordModel.findOne({
          serviceId,
          periodId: activePeriod._id,
        });
        if (!currentRecord) {
          return res.status(400).json({
            ok: false,
            message: "No hay lectura registrada para el periodo actual",
          });
        }
      }

      // Obtener cargos generales
      const generalCharges = await this.getGeneralCharges();

      // Obtener la tarifa activa
      const tariff = await TariffTableModel.findOne({
        active: true,
      });

      if (!tariff) {
        return res.status(400).json({
          ok: false,
          message: "No se encontró una tarifa aplicable",
        });
      }

      // Calcular el consumo
      const consumption = currentRecord
        ? currentRecord.currentRecord - service.lastRead
        : 0;

      // Ordenar las tarifas por consumo de menor a mayor
      const sortedTariffs = tariff.tariffs.sort(
        (a, b) => a.consumption - b.consumption
      );

      // Encontrar el rango de tarifa aplicable según el consumo
      const applicableTariff =
        sortedTariffs.find((t) => consumption == t.consumption) ||
        sortedTariffs[sortedTariffs.length - 1];

      // Obtener la tarifa según el tipo de servicio (domestic, commercial, mixed)
      const rate = applicableTariff[service.serviceType].toString();

      // Obtener la cuota base según el tipo de servicio
      const baseRate = applicableTariff[service.serviceType].toString();
      const consumptionAmount = consumption * Number(rate);

      // Calcular cargos adicionales
      let additionalCharges = 0;
      const appliedCharges = [];

      // Procesar cargos generales y sin medidor
      const allCharges = [...generalCharges, ...chargesWOMeter];
      for (const charge of allCharges) {
        additionalCharges += charge.amount;
        appliedCharges.push({
          chargeId: charge._id,
          name: charge.name,
          amount: charge.amount,
        });
      }

      const data = {
        serviceId,
        customerId: service.customerId,
        periodId: activePeriod._id,
        previousReading: service.lastRead,
        currentReading: currentRecord?.currentRecord || 0,
        consumption,
        tariffId: tariff._id,
        previousDebt: service.previousDebt,
        baseRate: Number(baseRate),
        consumptionAmount,
        charges: appliedCharges,
        additionalCharges,
        totalAmount: consumptionAmount + additionalCharges,
        dueDate: activePeriod.fecha_limite_pago,
        contractNumber: service._id,
        meterNumber: service.meterNumber,
        hasMeter: !!service.meterNumber,
        serviceType: service.serviceType,
        createdBy: req.uid,
      };

      console.log(data);

      // Crear el nuevo recibo
      const newBill = new BillModel(data);

      // Guardar el recibo
      await newBill.save();

      // Actualizar la última lectura del servicio
      service.lastRead = currentRecord?.currentRecord || 0;
      await service.save();

      return res.status(201).json({
        ok: true,
        bill: newBill,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        message: "Error al generar el recibo",
      });
    }
  };

  // Generar recibos para todos los servicios
  public generateBillsForAllServices = async (req: Request, res: Response) => {
    try {
      // Obtener el periodo activo
      const activePeriod = await PeriodModel.findOne({ isActive: true });
      if (!activePeriod) {
        return res.status(400).json({
          ok: false,
          message: "No hay un periodo activo",
        });
      }

      // Obtener todos los servicios activos
      const services = await ServiceModel.find({ status: true });

      const results = {
        success: 0,
        errors: [] as { serviceId: string; error: string }[],
      };

      // Procesar cada servicio
      for (const service of services) {
        try {
          // Verificar si ya existe un recibo
          const existingBill = await BillModel.findOne({
            serviceId: service._id,
            periodId: activePeriod._id,
          });

          if (existingBill) {
            results.errors.push({
              serviceId: service._id.toString(),
              error: "Ya existe un recibo para este periodo",
            });
            continue;
          }

          // Obtener la lectura actual
          const currentRecord = await RecordModel.findOne({
            serviceId: service._id,
            periodId: activePeriod._id,
          });

          if (!currentRecord) {
            results.errors.push({
              serviceId: service._id.toString(),
              error: "No hay lectura registrada",
            });
            continue;
          }

          // Obtener la tarifa activa
          const tariff = await TariffTableModel.findOne({
            active: true,
          });

          // Obtener los cargos aplicables
          const charges = await ChargeModel.find({
            active: true,
            $or: [
              { general: true },
              { applyWOMeter: true, special: false },
              { special: true },
            ],
          });

          if (!tariff) {
            results.errors.push({
              serviceId: service._id.toString(),
              error: "No se encontró una tarifa aplicable",
            });
            continue;
          }

          // Calcular el consumo
          const consumption = currentRecord
            ? currentRecord?.currentRecord - service.lastRead
            : 0;

          // Ordenar las tarifas por consumo de menor a mayor
          const sortedTariffs = tariff.tariffs.sort(
            (a, b) => a.consumption - b.consumption
          );

          // Encontrar el rango de tarifa aplicable según el consumo
          const applicableTariff =
            sortedTariffs.find((t) => consumption <= t.consumption) ||
            sortedTariffs[sortedTariffs.length - 1];

          // Obtener la tarifa según el tipo de servicio (domestic, commercial, mixed)
          const rate = applicableTariff[service.serviceType].toString();

          // Calcular cargos adicionales
          let additionalCharges = 0;
          const appliedCharges = [];

          for (const charge of charges) {
            if (
              charge.general ||
              (charge.applyWOMeter && !service.meterNumber) ||
              charge.special
            ) {
              additionalCharges += charge.amount;
              appliedCharges.push({
                chargeId: charge._id,
                name: charge.name,
                amount: charge.amount,
              });
            }
          }

          // Crear el nuevo recibo
          const newBill = new BillModel({
            serviceId: service._id,
            customerId: service.customerId,
            periodId: activePeriod._id,
            previousReading: service.lastRead,
            currentReading: currentRecord.currentRecord,
            consumption,
            tariffId: tariff._id,
            previousDebt: service.previousDebt,
            baseRate: Number(rate),
            consumptionAmount: consumption * Number(rate),
            appliedCharges,
            additionalCharges,
            totalAmount:
              consumption * Number(rate) + Number(rate) + additionalCharges,
            dueDate: activePeriod.fecha_limite_pago,
            contractNumber: service._id,
            meterNumber: service.meterNumber,
            hasMeter: !!service.meterNumber,
            serviceType: service.serviceType,
            createdBy: req.body.userId,
          });

          // Guardar el recibo
          await newBill.save();

          // Actualizar la última lectura del servicio
          service.lastRead = currentRecord.currentRecord;
          await service.save();

          results.success++;
        } catch (error) {
          results.errors.push({
            serviceId: service._id.toString(),
            error: "Error al procesar el servicio",
          });
        }
      }

      return res.status(200).json({
        ok: true,
        results,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        message: "Error al generar los recibos",
      });
    }
  };

  public getBillsByService = async (req: Request, res: Response) => {
    try {
      const { limit = 10, skip = 0 } = req.query;
      const { serviceId } = req.params;
      if (!serviceId) {
        return res.status(400).json({
          ok: false,
          message: "No se proporcionó el ID del servicio",
        });
      }

      const [total, bills] = await Promise.all([
        BillModel.countDocuments({ serviceId }),
        BillModel.find({ serviceId })
          .skip(Number(skip))
          .limit(Number(limit))
          .sort({ createdAt: -1 })
          .populate({ path: "createdBy", select: "name" })
          .populate({ path: "periodId", select: "name" }),
      ]);

      const totalPages = Math.ceil(total / Number(limit));
      const pagination = {
        total,
        totalPages,
        totalNow: bills.length,
      };

      return res.status(200).json({
        data: bills,
        pagination,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        message: "Error al obtener los recibos",
      });
    }
  };
}
