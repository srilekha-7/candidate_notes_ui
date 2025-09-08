import React, { useEffect, useState } from "react";
import { message } from "antd";
import api from "../utils/api";
import { ElementExecutor } from "../view/engine";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../utils/api";
import { io } from "socket.io-client";
function DashboardPage({ user }) {
  
const socket = io(BASE_URL);
    const token = localStorage.getItem("token"); 
  const navigate=useNavigate()
  const [schema, setSchema] = useState({
    schema: [
      {
        className: "bg-white rounded-xl shadow-md p-4",
        fields: [
          {
            element: "div",
            name: "headerRow",
            className: "flex justify-between items-center mb-4",
            fields: [
              {
                element: "div",
                name: "userName",
                label: `👋 Welcome, ${user?.name || "User"}`,
                className: "text-2xl font-bold text-gray-800",
              },{
              fields:[
                {
  element: "notifications",
  name: "notifications",
  className: "m-4", 
  buttonClassName: "bg-transparent border-none shadow-none",
  iconsClassName: "text-2xl text-gray-700 hover:text-blue-500",
  placement: "bottomRight",
  items: [], 
},{
                element: "button",
                name: "addCandidateBtn",
                label: "+ Add Candidate",
                className:
                  "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition",
              },
              ]}
              
            ],
          },
          {
            element: "table",
            name: "candidatesTable",
            thead: [
              { label: "Name", name: "name", key: "name" },
              { label: "Email", name: "email", key: "email" },
            ],
            pagination:true,
            value:{page:1,pageSize:10},
            tbody: [],
            rowKey: "_id",
            rowClick: true,
            className: `
    border rounded-md shadow-sm
    [&_.ant-table-thead>tr>th]:bg-blue-600 
    [&_.ant-table-thead>tr>th]:text-white 
    [&_.ant-table-thead>tr>th]:font-semibold 
    [&_.ant-table-thead>tr>th]:text-center
    [&_.ant-table-tbody>tr>td]:text-center
    [&_.ant-table]:table-fixed [&_.ant-table]:w-full
  `
          },
          {
            fields:[
          {
            element:"modal",
            visible:false,
            name:"candidateAddForm",
            className:"bg-white rounded-2xl p-8 md:p-12 w-100 md:w-100 z-9999 animate-fadeIn items-center",
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


        ],
        
      },
    ],
  });

   const updateTableData = (fields, tableName, data) => {
  return fields.map((field) => {
    if (field.element === "table" && field.name === tableName) {
      return { ...field, tbody: data };
    }
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


const updateSchemaWithNotifications = (fields, items) => {
  return fields.map((field) => {
    if ( field.name === "notifications") {
      return { ...field, items };
    }
    if (field.fields && field.fields.length > 0) {
      return { ...field, fields: updateSchemaWithNotifications(field.fields, items) };
    }
    return field;
  });
};

const fetchNotifications = async () => {
  try {
    const res = await api.get("/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.status){
      
  const items = res.data.data.map((n) => ({
    name: n.candidateId?.name,
    email: n.candidateId?.email,
    _id: n.candidateId?._id,
    message: n.message,
    messageId: n._id, 
    text: `${n.message}`, 
    time: new Date(n.createdAt).toLocaleString(), 
    isRead: n.isRead,
  }));

  setSchema((prev) => ({
    ...prev,
    schema: updateSchemaWithNotifications(prev.schema, items),
  }));
    }
    
  } catch (err) {
    toast.error("Failed to load notifications");
  }
};

  useEffect(() => {
    fetchCandidates();
    fetchNotifications()
     if (user?._id) {
    socket.emit("joinUserRoom", user._id);

    socket.on("newNotification", (notif) => {
      setSchema((prev) => ({
        ...prev,
        schema: updateSchemaWithNotifications(
          prev.schema,
          [notif, ...(prev.schema.find(f => f.name === "notificationsList")?.dataSource || [])]
        ),
      }));
      toast.success("You have a new notification!");
    });
  }

  return () => {
    socket.off("newNotification");
  };
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
    if (field.element === "modal" && field.name === modalName) {
      
      return { ...field, visible };
    }
    
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
  const handleSelectedRecord = async(field) => {
    if (field.name==="notifications"){
      
      try {
        
    await api.put(`/notifications/${field.value._id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate(`/candidate/${field.value.candidateId}/notes`, { state: field.value });
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
  }
    }
    

    if (field.name === "candidatesTable") {
  if (field.value.name === "view") {
    const candidateId = field.value.value._id;
    navigate(`/candidate/${candidateId}/notes`,{ state: field.value.value });
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

export default DashboardPage;
