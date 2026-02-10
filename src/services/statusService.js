import * as statusRepository from "../repositories/statusRepository.js";

/**
 * Service Layer สำหรับ Status
 */

export const getStatuses = async () => {
  const rows = await statusRepository.findAll();
  return rows.map((row) => ({ id: row.id, status: row.status }));
};

export const getStatusById = async (id) => {
  const status = await statusRepository.findById(id);
  if (!status) {
    throw new Error("STATUS_NOT_FOUND");
  }
  return { id: status.id, status: status.status };
};
