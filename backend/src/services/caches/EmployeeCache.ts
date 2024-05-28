import { getCache, setCache, deleteCache } from "./redis.services"

class EmployeeCache {
  private employeesKey: string;
  constructor() {
    this.employeesKey = "/employees";
  }

  async getCachedEmployees() {
    return await getCache(this.employeesKey);
  }

  async setCachedEmployees(employees: any[]) {
    const expiration = 60 * 60; // 1 hour 
    await setCache(this.employeesKey, expiration, employees);
  }

  /*
  - When do we invalidate

  1. Update employee, add employee, and remove employee in teh employee controller.

  2. Login route, if the person who logged in is an employee
    
  
  - NOTE: Since we're using a data-grid, and also only admins are going to see, we 
    should focus and prioritize this idea of very fresh data from our cache. And so 
    can happen frequently. Also since we're only delaing with users, and we aren't 
    referencing other entities, it's al ot easier to manage the cache.
  */
  async deleteCachedEmployees() {

    console.log("Employee cache deleted!");
    await deleteCache(this.employeesKey);
  }
}

const employeeCache = new EmployeeCache();
export default employeeCache;