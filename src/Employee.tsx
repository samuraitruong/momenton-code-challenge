import React, { Component } from "react";
import { EmployeeService } from "./service";
import { IEmployee, IHierarchyItem } from "./model";
interface IEmployeeState{
    employees?: IEmployee[],
    hierarchy?: IHierarchyItem<IEmployee>, 
    maxDeep?: number
}
export default class Employee extends Component<{},IEmployeeState> {
    private service: EmployeeService;
    constructor(props: any){
        super(props)
        this.service = new EmployeeService();
        this.state = {}
    }
    async componentDidMount(){
        this.showSample("data.json");
    }
    async showSample(file:string) {
        const employees = await this.service.fetchData(file);
        const hierarchy = this.service.transform(employees);
        const maxDeep = this.service.findMaxDeep(hierarchy);
        this.setState({employees, hierarchy, maxDeep}, () => {
            console.log(this.state);
        })
    }
    renderItem(item: IHierarchyItem<IEmployee>, maxDeep: number, deep: number =0) {
        const columns = [];
        for (let index = 0; index < maxDeep; index++) {
            columns.push( <td key={item.current.id+"_" + deep + "_" + index}>{deep ===index ?item.current.name:null}</td>)
        }
        return (
            <React.Fragment key={item.current.id}>
                <tr>
                   {columns}
                    
                </tr>
                {item.children.map(x => this.renderItem(x, maxDeep, deep +1))}

                </React.Fragment>
        )
    }
    render() {
        const{hierarchy = null, maxDeep} = this.state;

        return (
            <div>
                <h1>Company Structure</h1>
                <div className="Buttons">
                    <button onClick={() => this.showSample("data.json")}>Dataset 1</button>
                    <button onClick={() => this.showSample("data2.json")}>Dataset 2</button>
                    <button onClick={() => this.showSample("data3.json")}>Invalid data</button>
                </div>
                <table className="Org-Chart">
                <tbody>
                    {hierarchy && this.renderItem(hierarchy, maxDeep)}
                    </tbody>
                </table>

            </div>

        )
    }
}