import "./App.css";
import { Navbar } from "./components/Navbar";
import ReactQuill from "react-quill";
import { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
  ],
};

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(1);
  const [quillContent, setQuillContent] = useState("");
  const [note, setNote] = useState();
  const [tree, setTree] = useState([
    {
      id: 1,
      name: "Root",
      children: [],
      isBranch: true,
      parent: null,
    },
  ]);

  useEffect(() => {
    async function getNodes() {
      const response = await fetch("http://localhost:3000/nodes");
      const data = await response.json();
      setTree(data);
    }
    getNodes();
  }, []);

  useEffect(() => {
    async function getNote() {
      const response = await fetch(
        `http://localhost:3000/notes/${selectedNodeId}`
      );
      const data = await response.json();
      setNote(data);
      setQuillContent(data?.content || "");
    }
    getNote();
  }, [selectedNodeId]);

  async function handleSaveNote() {
    if (!note || !quillContent) return;

    const response = await fetch(`http://localhost:3000/notes/${note?._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: quillContent,
      }),
    });

    await response.json();
  }

  async function handleAddNode(isBranch) {
    const nodeName = window.prompt(
      `Wie soll ${isBranch ? "der neue Folder" : "die neue Datei"} heißen?`,
      `New ${isBranch ? "folder" : "file"}`
    );
    if (!nodeName) return;

    const currentNode = tree.find((treeNode) => treeNode.id === selectedNodeId);

    if (currentNode.isBranch === false) {
      // ist kein Ordner
      const parentId = currentNode.parent;
      const parentNode = tree.find((treeNode) => treeNode.id === parentId);

      const newNode = {
        name: nodeName,
        isBranch,
        parent: parentNode.id,
      };

      // create new node
      const responseNewNode = await fetch("http://localhost:3000/nodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNode),
      });

      const newNodeInDB = await responseNewNode.json();

      // add new node id to parent's children array
      const responseEditedNode = await fetch(
        `http://localhost:3000/nodes/${parentNode.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nodeId: newNodeInDB.id,
          }),
        }
      );

      await responseEditedNode.json();

      // create new, empty note
      const responseNewNote = await fetch("http://localhost:3000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          node: newNodeInDB.id,
        }),
      });

      const newTree = tree.map((node) => {
        if (node.id === parentNode.id) {
          return {
            ...node,
            children: [...node.children, newNodeInDB.id],
          };
        } else {
          return node;
        }
      });
      setTree([...newTree, newNodeInDB]);
    } else {
      // ist ein Ordner

      const newNode = {
        name: nodeName,
        isBranch,
        parent: selectedNodeId,
      };

      const responseNewNode = await fetch("http://localhost:3000/nodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNode),
      });

      const newNodeInDB = await responseNewNode.json();

      const responseEditedNode = await fetch(
        `http://localhost:3000/nodes/${selectedNodeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nodeId: newNodeInDB.id,
          }),
        }
      );

      await responseEditedNode.json();

      const newTree = tree.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            children: [...node.children, newNodeInDB.id],
          };
        } else {
          return node;
        }
      });

      setTree([...newTree, newNodeInDB]);
    }
  }

  return (
    <>
      <div className="flex z-20">
        <Navbar
          className="flex z-20"
          onHandleAdd={handleAddNode}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          tree={tree}
          setTree={setTree}
        />
      </div>
      <div className="h-screen">
        <div className="flex h-full justify-center">
          <div className="flex w-2/4 gap-4">
            <ReactQuill
              theme="snow"
              value={quillContent}
              onChange={setQuillContent}
              className="h-full w-full"
              modules={modules}
            />
            <button
              className="mt-10 bg-gray-50 cursor-pointer border border-gray-400 rounded-md px-6 h-12"
              onClick={handleSaveNote}
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
