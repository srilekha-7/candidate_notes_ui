import React, { useEffect, useState } from "react";
import { ElementExecutor } from "../view/engine";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 
import { io } from "socket.io-client";
import api from "../utils/api";
import toast from "react-hot-toast";
import { BASE_URL } from "../utils/api";
const socket = io(BASE_URL);

function ChatBook({ user }) {
    const { state } = useLocation();
    const [candidateData, setCandidateData] = useState("")
    const token = localStorage.getItem("token");
    const navigate = useNavigate()
    const [messages,setMessages]=useState()
    const [chatInput,setChatInput]=useState()
    const [schema, setSchema] = useState({
        schema: [
            {
                className: "bg-white rounded-xl shadow-md p-4",
                fields: [
                    {
                        element: "div",
                        name: "candidateChatBox",
                        fields: [
                            {
                                name: "candidateInfo",
                                className: "grid grid-cols-2 gap-2 mb-2",
                                fields: [
                                    {
                                        name: "nameRow",
                                        className: "flex",
                                        fields: [
                                            {
                                                element: "div",
                                                name: "candidateName",
                                                label: "Name:",
                                                className: "text-lg font-semibold text-gray-800",
                                            },
                                            {
                                                element: "div",
                                                name: "candidateNameValue",
                                                label: "",
                                                className: "text-lg text-gray-700",
                                            },
                                        ],
                                    },
                                    {
                                        name: "emailRow",
                                        className: "flex",
                                        fields: [
                                            {
                                                element: "div",
                                                name: "candidateEmail",
                                                label: "Email:",
                                                className: "text-lg font-semibold text-gray-800",
                                            },
                                            {
                                                element: "div",
                                                name: "candidateEmailValue",
                                                label: "",
                                                className: "text-lg text-gray-700",
                                            },
                                        ],
                                    },
                                ],
                            },

                            {
                                element:"div",
                                name: "chatMessages",
                                className:"flex-grow border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50 h-[60vh] overflow-y-auto",
                                fields:[]
                            },

                            {
                                name: "chatFooter",
                                className: "mt-4 flex space-x-2",
                                fields: [
                                    {
                                        element: "input-mention",
                                        name: "chatInput",
                                        options:[],
                                        placeholder: "Type your message...",
                                        className:
                                            "flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400",
                                    },
                                    {
                                        element: "button",
                                        name: "sendButton",
                                        label: "Send",
                                        className:
                                            "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    });
    
    const updateSchema = (fields) => {
        return fields.map((field) => {
            if (field.name === "candidateNameValue") {
                field.label = state.name
            }
            if (field.name === "candidateEmailValue") {
                field.label = state.email
            }

            if (field.fields && field.fields.length > 0) {
                const updatedFields = updateSchema(field.fields);
                return {
                    ...field,
                    fields: updatedFields
                };
            }

            return field;
        });
    };
const updateUsersInSchema = (fields,data) => {

  
   const options = data.map((d) => ({
  
    
    value: d.name,
    key:d._id,
    email:d.email,
    label: d.name,
  }));
  
        return fields?.map((field) => {
            
            if (field.name==="chatInput"){
              field.options=options
              
            }

            if (field.fields && field.fields.length > 0) {
                const updatedFields = updateUsersInSchema(field.fields,data);
                return {
                    ...field,
                    fields: updatedFields
                };
            }

            return field;
        });
    };
const updateMessagesInSchema = (fields, data) => {
  return fields?.map((field) => {
    if (field.name === "chatMessages") {
     
      if (data.length!==0){
        field.element=""
      }
      field.fields = data.map((msg) => ({
        className: "flex",
        fields: [
          {
            element: "div",
            name: `msgName-${msg._id}`,
            label: `${msg.userName}:`,
            className: `w-[100px] text-sm font-semibold text-gray-800 p-2 ${
              msg.user_id === user.id ? "text-right" : "text-left"
            }`,
          },
          {
            element: "div",
            name: `msg-${msg._id}`,
            label: msg.text,
            className: `w-full p-2 rounded ${
              msg.user_id === user.id
                ? "bg-blue-100 text-right"
                : "bg-gray-200 text-left"
            }`,
          },
        ],
      }));
      
      return field; 
    }

    if (field.fields && field.fields.length > 0) {
      return {
        ...field,
        fields: updateMessagesInSchema(field.fields, data),
      };
    }

    return field;
  });
};

    

    const getPayload = (fields) => {
  return fields.reduce((acc, field) => {
    if (field.name === "chatInput") {
      
      field.value = { value: "", mention: null };
      
    }

    if (field.fields && field.fields.length > 0) {
      const nestedPayload = getPayload(field.fields);
      Object.assign(acc, nestedPayload);
    }

    return acc;
  }, {});
};



    const fetchNotes = async () => {
    try {
      const res = await api.get(`/candidate/${state._id}/notes`,
        { headers: { Authorization: `Bearer ${token}` } });
      setMessages(res.data);
      setSchema((prev) => ({ ...prev, schema: updateMessagesInSchema(prev.schema ,res.data)}));
    } catch (err) {
        
      toast.error("Failed to load notes");
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await api.get(`/auth/users`,
        { headers: { Authorization: `Bearer ${token}` } });
        
      setSchema((prev) => ({ ...prev, schema: updateUsersInSchema(prev.schema ,res.data)}));
        
    } catch (err) {
        
      toast.error("Failed to load notes");
    }
  };
 useEffect(() => {
    if (state) {
      setCandidateData(state);
      setSchema((prev) => ({ ...prev, schema: updateSchema(prev.schema) }));
      fetchNotes();
      fetchUsers();

      socket.emit("joinRoom", state._id);

      socket.on("noteAdded", (note) => {
        
        setMessages((prev) => {
            
          const updated = [...prev, note];
          
      setSchema((prev) => ({ ...prev, schema: updateMessagesInSchema(prev.schema ,updated)}));
          return updated;
        });
      });
    }

    return () => {
      socket.off("noteAdded");
    };
  }, [state]);

    const handleSelectedRecord = async(field) => {
if (field.name==="chatInput"){
  
  setChatInput(field.value)
}
        if (field.name === "sendButton") {
let messageId;
       try {
      const res = await api.post(
        `/candidate/${state._id}/notes`,
        { text: chatInput.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status){
        
        messageId=res.data?.newNote._id
           getPayload(schema.schema);
      }
    }catch(err){
        console.log(err);
        
    }
    
    

      socket.emit("newNote", {
        candidateId: state._id,
        userId: user.id,
         text: chatInput.value,
         messageId:messageId,
        mention: chatInput.mention,
      });

     
    }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
            <ElementExecutor
                data={schema&&schema}
                setData={setSchema}
                selectedRecord={handleSelectedRecord}
            />
        </div>
    );
}

export default ChatBook;
