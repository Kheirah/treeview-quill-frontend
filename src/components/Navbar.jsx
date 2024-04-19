import TreeView from "./TreeView";
import { FaRegFolder } from "react-icons/fa6";
import { LuFolderTree } from "react-icons/lu";
import { FaRegFolderOpen } from "react-icons/fa6";
import { FaFolderPlus } from "react-icons/fa";
import { FaFolderMinus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaTrashRestore } from "react-icons/fa";
import { FiSidebar } from "react-icons/fi";
import { RiAccountCircleLine } from "react-icons/ri";
import { TbFolderPlus } from "react-icons/tb";
import { VscNewFile } from "react-icons/vsc";
import { GiPlantRoots } from "react-icons/gi";
import { IoLibraryOutline } from "react-icons/io5";
import { useState } from "react";
import { flattenTree } from "react-accessible-treeview";
import { v4 as uuid } from "uuid";

const rootId = uuid();
const bookId = uuid();
const chapterOneId = uuid();
const sceneOneId = uuid();
const sceneTwoId = uuid();
const sceneThreeId = uuid();
const chapterTwoId = uuid();
const ideasId = uuid();
const charactersId = uuid();

const folder = [
  {
    id: rootId,
    name: "Root",
    children: [bookId, ideasId, charactersId],
    isBranch: true,
    parent: null,
  },
  {
    id: bookId,
    name: "Book",
    isBranch: true,
    children: [chapterOneId],
    parent: rootId,
  },
  {
    id: chapterOneId,
    name: "Kapitel 1",
    isBranch: true,
    children: [sceneOneId, sceneTwoId, sceneThreeId],
    parent: bookId,
  },
  {
    id: sceneOneId,
    name: "Szene 1",
    isBranch: false,
    children: [],
    parent: chapterOneId,
  },
  {
    id: sceneTwoId,
    name: "Szene 2",
    isBranch: false,
    children: [],
    parent: chapterOneId,
  },
  {
    id: sceneThreeId,
    name: "Szene 3",
    isBranch: false,
    children: [],
    parent: chapterOneId,
  },
  {
    id: chapterTwoId,
    name: "Kapitel 2",
    isBranch: true,
    children: [],
    parent: bookId,
  },
  {
    id: ideasId,
    name: "Ideen",
    isBranch: true,
    children: [],
    parent: rootId,
  },
  {
    id: charactersId,
    name: "Charactere",
    isBranch: true,
    children: [],
    parent: rootId,
  },
];

const folder_old = {
  name: "",
  children: [
    {
      name: "Buch",
      children: [
        {
          name: "Kapitel 1",
          children: [{ name: "Szene 1.txt" }, { name: "Szene 2.txt" }],
        },
        {
          name: "Kapitel 2",
          children: [
            { name: "Szene 1.txt" },
            { name: "Szene 2.txt" },
            { name: "Szene 3.txt" },
          ],
        },
      ],
    },
    {
      name: "Ideen",
      children: [
        { name: "Braindump 1.txt" },
        { name: "Notizen.txt" },
        { name: "Noch mehr Ideen.txt" },
        { name: "AAAaaaahhhhh.txt" },
      ],
    },
    {
      name: "Charaktere",
      children: [
        { name: "Hauptcharakter.txt" },
        { name: "Nebencharakter.txt" },
        { name: "Max/Bob/Magnus.txt" },
      ],
    },
  ],
};

export function Navbar() {
  const [tree, setTree] = useState(folder);
  const [selectedNodeId, setSelectedNodeId] = useState(rootId);
  console.log(tree);

  function handleAddNode(isBranch) {
    const nodeName = window.prompt(
      `Wie soll ${isBranch ? "der neue Folder" : "die neue Datei"} heißen?`,
      `New ${isBranch ? "folder" : "file"}`
    );
    if (!nodeName) return;
    const newNode = {
      id: uuid(),
      name: nodeName,
      isBranch,
      children: [],
      parent: selectedNodeId,
    };
    const newTree = tree.map((node) => {
      if (node.id === selectedNodeId) {
        return {
          ...node,
          children: [...node.children, newNode.id],
        };
      } else {
        return node;
      }
    });
    setTree([...newTree, newNode]);
  }

  function handleSelectNode(id) {
    setSelectedNodeId(id);
  }

  return (
    <div className="fixed z-20 top-0 left-0 h-screen w-56 m-0 flex flex-col bg-[#537791] shadow-2xl">
      <div className="flex justify-end  bg-[#c1c0b9]">
        <button
          className="flex justify-between flex-1"
          onClick={() => {
            setSelectedNodeId(rootId);
          }}
        >
          <IoLibraryOutline className="text-[#f7f6e7] text-2xl" />
        </button>
        <button
          onClick={() => {
            handleAddNode(true);
          }}
        >
          <TbFolderPlus className="text-[#f7f6e7] text-2xl" />
        </button>
        <button
          onClick={() => handleAddNode(false)}
          className="text-[#f7f6e7] text-2xl"
        >
          <VscNewFile />
        </button>
      </div>
      <div className="text-[#f7f6e7] p-3 text-xl">
        <TreeView
          tree={tree}
          onSelectNode={handleSelectNode}
          selectedNodeId={selectedNodeId}
        />
      </div>
    </div>
  );
}
