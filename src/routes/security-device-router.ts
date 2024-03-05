import { Router } from "express";

export const securityDeviceRouter = Router();

securityDeviceRouter.get("/", (req, res) => {});
securityDeviceRouter.delete("/", (req, res) => {});
securityDeviceRouter.delete("/:id", (req, res) => {});
