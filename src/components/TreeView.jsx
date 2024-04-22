import TreeView, { flattenTree } from "react-accessible-treeview";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";
import { FaList, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { LuFolderTree } from "react-icons/lu";
import { FaFolderPlus } from "react-icons/fa";
import { FaFolderMinus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaTrashRestore } from "react-icons/fa";
import { FiSidebar } from "react-icons/fi";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";

function DirectoryTreeView({ tree, onSelectNode, selectedNodeId }) {
  /* console.log(selectedNodeId); */
  return (
    <div>
      <div className="directory">
        <TreeView
          data={tree}
          aria-label="directory tree"
          nodeRenderer={({
            element,
            isBranch,
            isExpanded,
            getNodeProps,
            level,
            handleExpand,
          }) => (
            <div
              {...getNodeProps()}
              onClick={(e) => {
                onSelectNode(element.id);
                handleExpand(e);
              }}
              style={{ paddingLeft: 20 * (level - 1) }}
              className="flex gap-x-2 items-center"
            >
              {isBranch ? (
                <FolderIcon
                  isOpen={isExpanded}
                  color={element.id === selectedNodeId ? "red" : "orange"}
                />
              ) : (
                <FileIcon
                  color={element.id === selectedNodeId ? "red" : "orange"}
                />
              )}

              {element.name}
            </div>
          )}
        />
      </div>
    </div>
  );
}

const FolderIcon = ({ isOpen, color = "orange" }) =>
  isOpen ? (
    <FaRegFolderOpen color={color} className="icon" />
  ) : (
    <FaRegFolder color={color} className="icon" />
  );

const FileIcon = ({ color = "orange" }) => {
  return <IoDocumentTextOutline color={color} className="icon" />;
};

export default DirectoryTreeView;
