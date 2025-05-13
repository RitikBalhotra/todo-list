import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Todo.css";

const Todo = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [finished, setFinished] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const todoList = localStorage.getItem("todoList");
    const finishedList = localStorage.getItem("finishedList");
    if (todoList) setTodos(JSON.parse(todoList));
    if (finishedList) setFinished(JSON.parse(finishedList));
  }, []);

  // Submit Function
  const handleSubmit = () => {
    if (task.trim()) {
      const now = new Date();
      const formatDate = now.toLocaleString();
      const newTodo = {
        text: task,
        time: formatDate,
      };
      const dt = [...todos, newTodo];
      setTodos(dt);
      localStorage.setItem("todoList", JSON.stringify(dt));
      setTask("");
      toast.success("TODO saved successfully!");
    }
  };

  // Delete Function
  const handleDelete = (index, isFinished) => {
    const dlt = window.confirm("This TODO will be deleted Permanently!");
    if (dlt) {
      if (isFinished) {
        const updateFinished = finished.filter((_, i) => i !== index);
        setFinished(updateFinished);
        localStorage.setItem("finishedList", JSON.stringify(updateFinished));
      } else {
        const updateTodo = todos.filter((_, i) => i !== index);
        setTodos(updateTodo);
        localStorage.setItem("todoList", JSON.stringify(updateTodo));
      }
      toast.info("TODO deleted.");
    }
  };

  // Update Function
  const handleUpdate = () => {
    if (isUpdate && currentId !== null) {
      const updateTodos = todos.map((item, index) =>
        index === currentId ? { ...item, text: task } : item
      );
      setTodos(updateTodos);
      localStorage.setItem("todoList", JSON.stringify(updateTodos));
      toast.success("Todo updated successfully!");
      setTask("");
      setIsUpdate(false);
      setCurrentId(null);
    }
  };

  // Handle Change Box
  const handleCheckBoxChange = (index) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  // Add Finished Function
  const addFinished = () => {
    const toMove = todos.filter((_, index) => selected.includes(index));
    const remain = todos.filter((_, index) => !selected.includes(index));

    const updateFinished = [...finished, ...toMove];
    setTodos(remain);
    setFinished(updateFinished);
    setSelected([]);

    localStorage.setItem("todoList", JSON.stringify(remain));
    localStorage.setItem("finishedList", JSON.stringify(updateFinished));
    toast.success("Moved to Finished!");
  };

  // Edit Function
  const handleEdit = (id) => {
    const editTodo = todos[id];
    setTask(editTodo.text);
    setIsUpdate(true);
    setCurrentId(id);
  };

  return (
    <>
      <div className="animated-bg">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
      </div>

      <div className="d-flex justify-content-center min-vh-100 align-items-center">
        <ToastContainer position="top-right" autoClose={2000} />
        <div
          className="p-4 rounded shadow bg-white todo-container"
          style={{ width: "700px" }}
        >
          <h3 className="text-center mb-4 bg-primary text-white p-2 rounded">
            TODO
          </h3>

          <div className="d-flex mb-3 gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Enter TODO"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            {!isUpdate ? (
              <button className="btn btn-primary" onClick={handleSubmit}>
                Add
              </button>
            ) : (
              <button className="btn btn-warning" onClick={handleUpdate}>
                Update
              </button>
            )}
          </div>

          <hr />

          {todos.length > 0 && (
            <ul className="list-group mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                <h4 className="text-primary fw-bold m-0">📝 Active Tasks</h4>
                <button
                  className="btn move-finish-btn"
                  disabled={selected.length === 0}
                  onClick={addFinished}
                >
                  ✅ Move to Finished
                </button>
              </div>

              {todos.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={selected.includes(index)}
                      onChange={() => handleCheckBoxChange(index)}
                    />
                    <strong>{item.text}</strong>
                    <div className="text-muted small">{item.time}</div>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(index, false)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {finished.length > 0 && (
            <ul className="list-group mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                <h4 className="text-success fw-bold m-0">✅ Finished Tasks</h4>
              </div>
              {finished.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked
                      readOnly
                    />
                    <del className="text-secondary fw-medium">{item.text}</del>
                    <br />
                    <small className="text-muted">{item.time}</small>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(index, true)}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Todo;
