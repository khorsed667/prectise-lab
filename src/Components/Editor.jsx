import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Editor.css";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import ACTIONS from "../Socket/action";

const Editor = ({ socketRef }) => {
  const editorRef = useRef(null);
  const codemirrorInstance = useRef(null);

  const roomId = localStorage.getItem("roomId");

  useEffect(() => {
    
    codemirrorInstance.current = Codemirror.fromTextArea(editorRef.current, {
      mode: { name: "javascript", json: true },
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

    
    codemirrorInstance.current.on("change", (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      if (origin !== "setValue") {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    });

    return () => {
      codemirrorInstance.current.toTextArea();
    };
  }, [socketRef, roomId]); 

  useEffect(() => {
    if (socketRef.current) {
      
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        console.log(code);
        if (code !== null) {
          codemirrorInstance.current.setValue(code);
        }
      });
      return () =>{
        socketRef.current.off(ACTIONS.CODE_CHANGE)
      }
    }
  }, [socketRef.current]);

  return <textarea ref={editorRef} id="editorArea"></textarea>;
};

Editor.propTypes = {
  socketRef: PropTypes.object.isRequired,
};

export default Editor;
