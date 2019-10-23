import { EmployeeService } from "./EmployeeService";
import { IEmployee } from "./model";
import { MESSAGES } from "./Constants";

describe("EmployeeService tests", () => {
  const service = new EmployeeService();

  describe("findMaxDeep tests", () => {
    it("findMaxDeep should return 1", () => {
      const deep = service.findMaxDeep({
        current: { name: "root", id: 1 },
        children: []
      });
      expect(deep).toEqual(1);
    });

    it("findMaxDeep should return 2", () => {
      const deep = service.findMaxDeep({
        current: { name: "root", id: 1 },
        children: [
          {
            current: { name: "child", id: 2 },
            children: []
          }
        ]
      });
      expect(deep).toEqual(2);
    });
    it("findMaxDeep should return 3", () => {
      const deep = service.findMaxDeep({
        current: { name: "root", id: 1 },
        children: [
          {
            current: { name: "child", id: 2 },
            children: []
          },
          {
            current: { name: "child 2", id: 3 },
            children: [
              {
                current: { name: "child 3", id: 4 },
                children: []
              }
            ]
          }
        ]
      });
      expect(deep).toEqual(3);
    });
  });
  describe("transform test", () => {
    it("transform should convert 2 row to hierarchy with 1 parent and 1 child", () => {
      const data: IEmployee[] = [
        { name: "CEO", id: 1 },
        { name: "Staff", id: 2, managerId: 1 }
      ];
      const result = service.transform(data);
      expect(result).toEqual({
        current: { name: "CEO", id: 1 },
        children: [
          {
            current: { name: "Staff", id: 2, managerId: 1 },
            children: []
          }
        ]
      });
    });

    it("transform should convert 3 row to hierarchy with 1 parent and 1 child", () => {
        const data: IEmployee[] = [
          { name: "CEO", id: 1 },
          { name: "Staff", id: 2, managerId: 1 },
          { name: "Staff2", id: 3, managerId: 1 }
        ];
        const result = service.transform(data);
        expect(result).toEqual({
          current: { name: "CEO", id: 1 },
          children: [
            {
              current: { name: "Staff", id: 2, managerId: 1 },
              children: []
            },
            {
                current: { name: "Staff2", id: 3, managerId: 1 },
                children: []
              }
          ]
        });
      });

      it("transform should convert multiple row to hierarchy with multiple level", () => {
        const data: IEmployee[] = [
          { name: "CEO", id: 1 },
          { name: "HR Manager", id: 2, managerId: 1 },
          { name: "Delivery Manager", id: 3, managerId: 1 },
          { name: "Hr", id: 4, managerId: 2 },
          { name: "Developer", id: 5, managerId: 3 },
          { name: "QA", id: 6, managerId: 3 }
        ];
        const result = service.transform(data);
        expect(result).toEqual({
          current: { name: "CEO", id: 1 },
          children: [
            {
              current:  { name: "HR Manager", id: 2, managerId: 1 },
              children: [
                  {current: { name: "Hr", id: 4, managerId: 2 }, children: []}
              ]
            },
            {
                current: { name: "Delivery Manager", id: 3, managerId: 1 },
                children: [
                    {
                        current: { name: "Developer", id: 5, managerId: 3 }, children: []
                    },{
                        current: { name: "QA", id: 6, managerId: 3 }, children: [],
                    }
                ]
              }
          ]
        });
      });

      it("transform should exclude employee with invalid manager id", () => {
        const data: IEmployee[] = [
          { name: "CEO", id: 1 },
          { name: "Staff", id: 2, managerId: 1 },
          { name: "Invalid", id: 3, managerId: 100 } // this manager Id is not existing
        ];
        const result = service.transform(data);
        expect(result).toEqual({
          current: { name: "CEO", id: 1 },
          children: [
            {
              current: { name: "Staff", id: 2, managerId: 1 },
              children: []
            }
          ]
        });
      });

      it("transform should throw exception when data invalid with multiple employee without managerId", () => {
        const data: IEmployee[] = [
            { name: "CEO", id: 1 },
            { name: "Another CEO", id: 2 },
            { name: "Staff", id: 2, managerId: 1 },
            { name: "Invalid", id: 3, managerId: 100 } // this manager Id is not existing
          ];

          expect(() => service.transform(data)).toThrow(MESSAGES.MultipleCEOFound);
      })
      it("transform should throw exception when employee doesn't has valid id", () => {
        const data: IEmployee[] = [
            { name: "CEO", id: 1 },
            { name: "Staff", id: 2, managerId: 1 },
            { name: "Invalid", id: 3, managerId: 100 } // this manager Id is not existing
          ];
          data[1].id = null;

          expect(() => service.transform(data)).toThrow(MESSAGES.EmployeeWithNoId);
      })
      it("transform should throw exception when no CEO in data set", () => {
        const data: IEmployee[] = [
            { name: "CEO", id: 1, managerId: 123 },
            { name: "Staff", id: 2, managerId: 1 },
            { name: "Invalid", id: 3, managerId: 100 } // this manager Id is not existing
          ];
          data[1].id = null;

          expect(() => service.transform(data)).toThrow(MESSAGES.NoCEOFound);
      })
  });
});
