import { IEmployee, IHierarchyItem } from "./model";

export class EmployeeService {
    /**
     * Fetching sample data from static json file
     */
  async fetchData(file: string): Promise<IEmployee[]> {
    const response = await fetch("/" + file);
    const data = await response.json();
    return data as IEmployee[];
  }
  /**
   * The function to transform tabular data structure to hierarchical data
   * @param data input data is a flat list of employee
   * @return the output is hirachical data
   *
   */
  transform(data: IEmployee[]): IHierarchyItem<IEmployee> {
    const employees = [...data];
    // CEO is employee with no manager, if there is more than 1 CEO, stop process with error as invalid data

    const ceo = employees.filter(x => !x.managerId);

    if (ceo && ceo.length > 1) {
      throw new Error("Multiple employee has no manager");
    }

    const dict: { [x: number]: IHierarchyItem<IEmployee> } = {};
    // Should we care about data with duplicate employee Id, 
    // Using dictionary to store reference data, this is fastest way to process data
    // With this method if there is an employee with invalid manager ID, it will automatically excluded from the Hierarchy , seem sample 4
    for (const item of employees) {
      if (!dict[item.id]) {
        
        dict[item.id] = {
          current: item,
          children: []
        };
      } else {
        // if we care about validate duplicate ID, we should implement it here by check dict[item.id].current  != null
        dict[item.id].current = item;
      }

      if (item.managerId && dict[item.managerId]) {
        dict[item.managerId].children.push(dict[item.id]);
      }

      if (item.managerId && !dict[item.managerId]) {
        dict[item.managerId] = {
          children: [dict[item.id]]
        };
      }
    }

    return dict[ceo[0].id];
  }
  
  /**
   * Recursive to find the max nested level of data
   * @param data 
   * @param currentDeep 
   */
  findMaxDeep(data: IHierarchyItem<IEmployee>, currentDeep: number = 0) {
    if (!data.children || data.children.length === 0) {
        return currentDeep + 1;
    }
    let maxDeep = 0;
    for (const item of data.children) {
        const childDeep = this.findMaxDeep(item, currentDeep +1);
        maxDeep = Math.max(childDeep, maxDeep);
    }
    return maxDeep;
  }
}
