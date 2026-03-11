import { serviceRepository } from "../config/data-source";
import { IServiceDto } from "../dto/IServicdeDto";
import { Service } from "../entities/Service";

export const getAllServicesService = async (): Promise<Service[]> => {
  return await serviceRepository.find({
    where: { isActive: true },
    order: { name: "ASC" },
  });
};

export const getServiceByIdService = async (id: number): Promise<Service> => {
  const service = await serviceRepository.findOne({ where: { id } });
  if (!service) throw new Error("Servicio no encontrado");
  return service;
};

export const createServiceService = async (
  data: IServiceDto,
): Promise<Service> => {
  const existing = await serviceRepository.findOne({
    where: { name: data.name },
  });
  if (existing) throw new Error("Ya existe un servicio con ese nombre");
  const service = serviceRepository.create(data);
  return await serviceRepository.save(service);
};

export const updateServiceService = async (
  id: number,
  data: Partial<IServiceDto>,
): Promise<Service> => {
  const service = await getServiceByIdService(id);
  Object.assign(service, data);
  return await serviceRepository.save(service);
};

export const deleteServiceService = async (id: number): Promise<void> => {
  const service = await getServiceByIdService(id);
  service.isActive = false;
  await serviceRepository.save(service);
};
