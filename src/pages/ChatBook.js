import React, { useEffect, useState } from "react";
import { ElementExecutor } from "../view/engine";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 
import { io } from "socket.io-client";
import api from "../utils/api";
import toast from "react-hot-toast";
import { BASE_URL } from "../utils/api";
const socket = io(BASE_URL);
console.log(BASE_URL);

function ChatBook({ user }) {
    const { state } = useLocation();
    const [candidateData, setCandidateData] = useState("")
    const token = localStorage.getItem("token");
    const navigate = useNavigate()
    const [messages,setMessages]=useState()
    const [schema, setSchema] = useState({
        schema: [
            {
                className: "bg-white rounded-xl shadow-md p-4",
                fields: [
                    {
                        element: "div",
                        name: "candidateChatBox",
                        fields: [
                            // Candidate Info
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

                            // Chat messages area
                            {
                                element: "div",
                                name: "chatMessages",
                                className:
                                    "flex-grow border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50 h-[60vh] overflow-y-auto",
                                fields: [],
                            },

                            // Footer input + button
                            {
                                name: "chatFooter",
                                className: "mt-4 flex space-x-2",
                                fields: [
                                    {
                                        element: "input-text",
                                        name: "chatInput",
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
            // Direct match for modal
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

   
    

    const getPayload = (fields) => {
        return fields.reduce((acc, field) => {
            if (field.name === "chatInput") {
                acc[field.name] = field.value;
                field.value=""
            }

            if (field.fields && field.fields.length > 0) {
                const nestedPayload = getPayload(field.fields);
                Object.assign(acc, nestedPayload); 
            }

            return acc;
        }, {});
    };
const updateMessagesInSchema = (msgs) => {
  
  setSchema((prev) => {
    const updateFields = (fields) =>
      fields.map((field) => {
        if (field.name === "chatMessages") {
            
          return {
            ...field,        
            fields: msgs.map((msg) => (
                {className:"grid grid-cols-2",
                    fields:[{ element: "div",
              name: `msgName-${msg._id}`,
              label: `${msg.userName}:`,
              className:"text-sm font-semibold text-gray-800 p-2 text-right"
            }, {
              element: "div",
              name: `msg-${msg._id}`,
              label: msg.text,
              className: `p-2 rounded ${
                msg.user_id === user.id
                  ? "bg-blue-100 text-right"
                  : "bg-gray-200 text-left"
              }`,
            }]}
               )),
          };
        }

        if (field.fields && field.fields.length > 0) {
          return {
            ...field,
            fields: updateFields(field.fields),
          };
        }

        return field;
      });

    return {
      ...prev,
      schema: prev.schema.map((section) => ({
        ...section,
        fields: updateFields(section.fields),
      })),
    };
  });
};


    const fetchNotes = async () => {
    try {
      const res = await api.get(`/candidate/${state._id}/notes`);
      setMessages(res.data);
      updateMessagesInSchema(res.data);
    } catch (err) {
        console.log(err);
        
      toast.error("Failed to load notes");
    }
  };
 useEffect(() => {
    if (state) {
      setCandidateData(state);
      setSchema((prev) => ({ ...prev, schema: updateSchema(prev.schema) }));
      fetchNotes();

      socket.emit("joinRoom", state._id);

      socket.on("noteAdded", (note) => {
        console.log("note",note);
        
        setMessages((prev) => {
            
          const updated = [...prev, note];
          updateMessagesInSchema(updated);
          return updated;
        });
      });
    }

    return () => {
      socket.off("noteAdded");
    };
  }, [state]);

    const handleSelectedRecord = async(field) => {



        if (field.name === "sendButton") {
      const payload = getPayload(schema.schema);
      if (!payload.chatInput.trim()) return;
       try {
      const res = await api.post(
        `/candidate/${state._id}/notes`,
        { text: payload.chatInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }catch(err){
        console.log(err);
        
    }

      socket.emit("newNote", {
        candidateId: state._id,
        userId: user._id,
        text: payload.chatInput,
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
