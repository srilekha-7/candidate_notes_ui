import React, { useEffect, useState } from "react";
import { message } from "antd";
import api from "../utils/api";
import { ElementExecutor } from "../view/engine";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
function ChatBook({ user }) {
  console.log(user);
  
    const token = localStorage.getItem("token"); 
  const navigate=useNavigate()
  const [schema, setSchema] = useState({
    schema: [
      {
        className: "bg-white rounded-xl shadow-md p-4",
        fields: [
          
           {
            fields:[
          {
            element:"modal",
            visible:false,
            name:"candidateNotesForm",
            className:"bg-white rounded-2xl p-8 md:p-12 w-100 md:w-100 z-10 animate-fadeIn items-center",
            fields:[
               {
      element:"div",
      name:"closeModal",
      className:"absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700 text-xl font-bold pb-2",
      label:"×",
     
    },
    {
      element: "input-text",
      name: "name",
      label: "Name",
      placeholder: "Enter your name",
      className:
        "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50",
      labelClassName: "block text-gray-700 font-medium mb-1",
      errorClassName: "text-red-500 text-sm mt-1",
    },
     {
        element: "input-text",
        name: "email",
        label: "Email",
        placeholder: "Enter your email",
        className:
          "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 mt-2",
        labelClassName: "block text-gray-700 font-medium mb-1",
        errorClassName: "text-red-500 text-sm mt-1",
      },
      
      {
        element: "button",
        name: "submitButton",
        label: "Submit",
        className:
          "w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 mt-4",
      },]
          }
        ]
          },
//           {
//   fields: [
//     {
//       element: "modal",
//       visible: false,
//       name: "candidateNotesForm",
//       className:
//         "bg-white rounded-2xl p-8 md:p-12 w-[80vw] h-[80vh] z-10 animate-fadeIn relative flex flex-col",
//       fields: [
//         {
//           element: "div",
//           name: "closeModal",
//           className:
//             "absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700 text-2xl font-bold",
//           label: "×",
//         },
//         {
//           element: "div",
//           name: "formBox",
//           className:
//             "flex flex-col border border-gray-300 rounded-lg p-6 overflow-y-auto flex-grow",
//           fields: [
//             {
//               element: "div",
//               name: "inputGroup",
//               className: "flex flex-col space-y-4",
//               fields: [
//                 {
//                   element: "input-text",
//                   name: "name",
//                   label: "Name",
//                   placeholder: "Enter candidate name",
//                   className:
//                     "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50",
//                   labelClassName: "block text-gray-700 font-medium mb-1",
//                   errorClassName: "text-red-500 text-sm mt-1",
//                 },
//                 {
//                   element: "input-text",
//                   name: "email",
//                   label: "Email",
//                   placeholder: "Enter candidate email",
//                   className:
//                     "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50",
//                   labelClassName: "block text-gray-700 font-medium mb-1",
//                   errorClassName: "text-red-500 text-sm mt-1",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           element: "div",
//           name: "footer",
//           className:
//             "w-full flex items-center justify-end mt-4 border-t border-gray-200 pt-4",
//           fields: [
//             {
//               element: "button",
//               name: "submitButton",
//               label: "Submit",
//               className:
//                 "bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all duration-200",
//             },
//           ],
//         },
//       ],
//     },
//   ],
// }

        ],
        
      },
    ],
  });

  // Fetch candidates from backend
   const updateTableData = (fields, tableName, data) => {
  return fields.map((field) => {
    // If this is the table we want, update its tbody
    if (field.element === "table" && field.name === tableName) {
      return { ...field, tbody: data };
    }
    // If the field has nested fields, recurse
    if (field.fields && field.fields.length > 0) {
      return { ...field, fields: updateTableData(field.fields, tableName, data) };
    }
    return field;
  });
};
  const fetchCandidates = async () => {
    try {
      const res = await api.get("/candidate",{
        headers: {
        Authorization: `Bearer ${token}`,
      },
      });
     

if (res.data.status) {
  setSchema((prev) => {
    return {
      ...prev,
      schema: updateTableData(prev.schema, "candidatesTable", res.data.candidates),
    };
  });
}

      
    } catch (err) {
      message.error("Failed to fetch candidates");
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);
  const addCandidiate=async(payload)=>{
    try {
      const res = await api.post("/candidate", payload,{
        headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      
      if (res.data.status === true) {
        
        fetchCandidates();
        toast.success("Login Successful!");

        
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      
      toast.error(err.response?.data?.message || "Something went wrong!");
    } 
  }
const updateSchemaVisibility = (fields, modalName, visible) => {
  return fields.map((field) => {
    // Direct match for modal
    if (field.element === "modal" && field.name === modalName) {
      console.log({...field, visible})
      return { ...field, visible };
    }
    
    // If nested fields exist, recurse deeply
    if (field.fields && field.fields.length > 0) {
      const updatedFields = updateSchemaVisibility(field.fields, modalName, visible);
      return { 
        ...field, 
        fields: updatedFields
      };
    }

    return field;
  });
};

const buildPayloadFromModal = (fields) => {
  const modal = fields.find(f => f.element === "modal" && f.name === "candidateAddForm");
  if (!modal) {
    for (const f of fields) {
      if (f.fields && f.fields.length > 0) {
        const result = buildPayloadFromModal(f.fields);
        if (result) return result;
      }
    }
    return null;
  }

  const collectInputs = (fields) => {
    return fields.reduce((acc, field) => {
      if (field.fields && field.fields.length > 0) {
        return { ...acc, ...collectInputs(field.fields) };
      } else if (field.element !== "button" && field.element !== "div") {
        acc[field.name] = field.value || "";
        field.value = "";
        
      }
      return acc;
    }, {});
  };

  return collectInputs(modal.fields);
};
  const handleSelectedRecord = (field) => {
 

    if (field.name === "candidatesTable") {
      if (field.value.name==="view"){
        setSchema((prevSchema) => ({
      ...prevSchema,
      schema: updateSchemaVisibility(prevSchema.schema, "candidateNotesForm", true)
    }));
      }
      
    
  }
  if (field.name === "addCandidateBtn") {
     setSchema((prevSchema) => ({
      ...prevSchema,
      schema: updateSchemaVisibility(prevSchema.schema, "candidateAddForm", true)
    }));
  }
  if (field.name==="closeModal"){
    
    setSchema(prev => ({
      ...prev,
      schema: updateSchemaVisibility(
        updateSchemaVisibility(prev.schema, "candidateAddForm", false)
      )
    }));
  }
  if (field.name==="submitButton"){
    const payload = buildPayloadFromModal(schema.schema);
    
    addCandidiate(payload)
    setSchema(prev => ({
      ...prev,
      schema: updateSchemaVisibility(prev.schema, "candidateAddForm", false)
    }));


  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <ElementExecutor
        data={schema}
        setData={setSchema}
        selectedRecord={handleSelectedRecord}
      />
    </div>
  );
}

export default ChatBook;
