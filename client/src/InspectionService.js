import axios from "axios";
axios.defaults.headers.common = {
  "Content-Type": "application/json",
};
axios.defaults.baseURL = location.origin;

const url = "api/inspections/";

class InspectionService {
  // Get Inspections
  static getInspections(params) {
    return new Promise(async (resolve, reject) => {
      try {
        if (params) {
          params = "?" + params;
        }
        const res = await axios.get(url + params);
        const data = res.data;
        resolve(
          data.map((inspection) => ({
            ...inspection,
            createdAt: new Date(inspection.createdAt),
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  // Get Inspection By ID
  static getInspectionsByID(id){
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url + id);
        const data = res.data;
        console.log(res)
        resolve(
          data.map((inspection) => ({
            ...inspection,
            createdAt: new Date(inspection.createdAt),
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  // Create Inspection
  static insertInspection(body) {
    console.log(body);
    return axios.post(url, body);
  }

  // Update Inspection
  static updateInspection(id, body) {
    console.log(body)
    return axios.put(`${url}${id}`, body);
  }

  // Delete Inspection
  static deleteInspection(id) {
    return axios.delete(`${url}${id}`);
  }
}

export default InspectionService;
