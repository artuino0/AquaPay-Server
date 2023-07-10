import { Request, Response } from "express";
import fs from "fs-extra";
import path from "path";
import multer from "multer";
import { SettingsModel } from "../models/settings.model";

const upload = multer({
  dest: "public/",
});

const saveSettings = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const image = req.file;
    const settings = await SettingsModel.findOne().exec();

    if (settings) {
      settings.companyName = data.companyName;
      settings.address = data.address;
      settings.downtown = data.downtown;
      settings.postalCode = data.postalCode;
      settings.city_state = data.city_state;
      settings.phone = data.phone;
      settings.cellphone = data.cellphone;

      if (image) {
        settings.imagen = "logo_company.png";
      }

      settings.save();
    } else {
      const newData = new SettingsModel({
        companyName: data.companyName,
        address: data.address,
        downtown: data.downtown,
        postalCode: data.postalCode,
        city_state: data.city_state,
        phone: data.phone,
        cellphone: data.cellphone,
        imagen: image ? "logo_company.png" : null,
      });

      await newData.save();
    }
    if (image) {
      const imagePath = path.join("public/", "logo_company.png");
      await fs.copyFile(image.path, imagePath);
      await fs.unlink(image.path);
      console.log("Imagen guardada:", imagePath);
    }

    res.status(200).json({ message: "Datos recibidos correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al guardar los datos" });
  }
};

const getSettings = (req: Request, res: Response) => {
  SettingsModel.findOne()
    .then((rs) => {
      if (!rs) return res.status(404).json({ error: "Settings not found" });
      res.json(rs);
    })
    .catch((e) => {
      res.status(403).json(e);
    });
};

export { upload, saveSettings, getSettings };
