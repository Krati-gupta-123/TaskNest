import React, { useState } from 'react';


function Project() {
  const [columns, setcolumns] = useState({
    todo: {
      name: "To Do",
      items: [
        { id: "1", content: "Marketing", description: "Plan ad campaigns", date: "12/08/2025" },
        { id: "2", content: "Research", description: "Market analysis", date: "12/08/2025" }
      ],
    },
    inProgress: {
      name: "In Progress",
      items: [
        { id: "3", content: "Developer", description: "Frontend coding", date: "12/08/2025" }
      ]
    },
    done: {
      name: "Done",
      items: [
        { id: "4", content: "UI Designer", description: "Design completed", date: "12/08/2025" }
      ]
    },
  });

  const [newTask, setNewTask] = useState("");
  const [activeColmns, setActiveColumns] = useState("todo");
  const [draggedItem, setDraggedItem] = useState(null);
  const [lightMode, setLightMode] = useState(false);

  const addNewTask = () => {
    if (newTask.trim() === "") return;

    const updatedColumns = { ...columns };

    updatedColumns[activeColmns].items.push({
      id: Date.now().toString(),
      content: newTask,
      description: "No description",
      date: new Date().toLocaleDateString(),
    });

    setcolumns(updatedColumns);
    setNewTask("");
  };

  const removeTask = (columnId, taskId) => {
    const updatedColumns = { ...columns };
    updatedColumns[columnId].items = updatedColumns[columnId].items.filter(
      (item) => item.id !== taskId
    );
    setcolumns(updatedColumns);
  };

  const editTask = (columnId, taskId) => {
    const updatedColumns = { ...columns };
    const taskToEdit = updatedColumns[columnId].items.find(
      (item) => item.id === taskId
    );

    if (!taskToEdit) return;

    const newContent = prompt("Edit task content:", taskToEdit.content);
    const newDescription = prompt("Edit task description:", taskToEdit.description);

    if (newContent && newContent.trim() !== "") {
      updatedColumns[columnId].items = updatedColumns[columnId].items.map((item) =>
        item.id === taskId
          ? {
              ...item,
              content: newContent,
              description: newDescription || "",
            }
          : item
      );
      setcolumns(updatedColumns);
    }
  };

  const handleDragStart = (columnId, item) => {
    setDraggedItem({ columnId, item });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnId: sourceColumnId, item } = draggedItem;
    if (sourceColumnId === columnId) return;

    const updatedColumns = { ...columns };
    updatedColumns[sourceColumnId].items = updatedColumns[sourceColumnId].items.filter(
      (i) => i.id !== item.id
    );
    updatedColumns[columnId].items.push(item);

    setcolumns(updatedColumns);
    setDraggedItem(null);
  };

  const columnStyles = {
    column: { width: "100%" },
    todo: { header: "todo-header", border: "todo-border" },
    inProgress: { header: "inprogress-header", border: "inprogress-border" },
    done: { header: "done-header", border: "done-border" },
  };

  return (
    <>
      <div className={`page-container ${lightMode ? "light-mode" : ""}`}>
        <button
          className={`theme-toggle ${lightMode ? "light-mode" : ""}`}
          onClick={() => setLightMode(!lightMode)}
        >
          {lightMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>

        <div className="inner-container">
          <h1 className="title">TaskNest</h1>

          <div className="task-input-container">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="task-input"
              onKeyDown={(e) => e.key === "Enter" && addNewTask()}
            />

            <select
              value={activeColmns}
              onChange={(e) => setActiveColumns(e.target.value)}
              className="task-select"
            >
              {Object.keys(columns).map((columnId) => (
                <option value={columnId} key={columnId}>
                  {columns[columnId].name}
                </option>
              ))}
            </select>

            <button onClick={addNewTask} className="add-btn">
              Add
            </button>
          </div>

          <div className="columns-container">
            {Object.keys(columns).map((columnId) => (
              <div
                key={columnId}
                className={`column ${columnStyles[columnId].border}`}
                onDragOver={(e) => handleDragOver(e, columnId)}
                onDrop={(e) => handleDrop(e, columnId)}
              >
                <div className={`column-header ${columnStyles[columnId].header}`}>
                  {columns[columnId].name}
                  <span className="task-count">{columns[columnId].items.length}</span>
                </div>

                <div className="column-body">
                  {columns[columnId].items.length === 0 ? (
                    <div className="drop-placeholder">Drop tasks here</div>
                  ) : (
                    columns[columnId].items.map((item) => (
                      <div
                        key={item.id}
                        className="task-card"
                        draggable
                        onDragStart={() => handleDragStart(columnId, item)}
                      >
                        <div>
                          <button
                            onClick={() => removeTask(columnId, item.id)}
                            className="remove-btn"
                          >
                            <span>x</span>
                          </button>
                        </div>
                        <span className="task-title">{item.content}</span>
                        <p className="task-desc">{item.description}</p>
                        <small className="task-date">{item.date}</small>
                        <button
                          onClick={() => editTask(columnId, item.id)}
                          className="edit-btn"
                        >
                          <span>Edit</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Project;
