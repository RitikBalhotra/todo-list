import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Todo = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [finished, setFinished] = useState([]);

  useEffect(() => {
    const todoList = localStorage.getItem("todoList");
    const finishedList = localStorage.getItem("finishedList");
    if (todoList || finishedList) {
      setTodos(JSON.parse(todoList));
      console.log(todos);
      setFinished(JSON.parse(finishedList));
      console.log(finished);
    }
  }, []);

  // add todo function
  const handleSubmit = () => {
    if (task.trim()) {
      const dt = [...todos, task];
      setTodos(dt);
      localStorage.setItem("todoList", JSON.stringify(dt));
      setTask("");
      toast.success("TODO saved successfully!");
    }
  };

  // delete button function
  const handleDelete = (index, isFinished) => {
    const dlt = window.confirm("This TODO will be deleted Permanently!");
    if (dlt) {
      if (isFinished) {
        // delete from the finished list
        const updateFinished = finished.filter((_, i) => i !== index);
        setFinished(updateFinished);
        localStorage.setItem("finishedList", JSON.stringify(updateFinished));
      } else {
        // delete form the  todo list
        const updateTodo = todos.filter((_, i) => i !== index);
        setTodos(updateTodo);
        localStorage.setItem("todoList", JSON.stringify(updateTodo));
      }
      toast.info("TODO deleted.");
    }
  };

  // handle update function
  const handleUpdate = () => {
    if (isUpdate && currentId !== null) {
      const updateTodos = todos.map((item, index) =>
        index === currentId ? task : item
      );
      setTodos(updateTodos);
      localStorage.setItem("todoList", JSON.stringify(updateTodos));
      toast.success("Todo Update Successfully!");
      setTask("");
      setIsUpdate(false);
      setCurrentId(null);
    }
  };

  // toggle function
  const handleToggle = (todo, isFinished) => {
    if (isFinished) {
      const updatedFinished = finished.filter((t) => t !== todo);
      const updatedTodos = [...todos, todo];
      setFinished(updatedFinished);
      setTodos(updatedTodos);
      localStorage.setItem("finishedList", JSON.stringify(updatedFinished));
      localStorage.setItem("todoList", JSON.stringify(updatedTodos));
    } else {
      const updatedTodos = todos.filter((t) => t !== todo);
      const updatedFinished = [...finished, todo];
      setTodos(updatedTodos);
      setFinished(updatedFinished);
      localStorage.setItem("todoList", JSON.stringify(updatedTodos));
      localStorage.setItem("finishedList", JSON.stringify(updatedFinished));
    }
  };

  // handle edit buttton in list
  const handleEdit = (id) => {
    const editTodo = todos[id];
    setTask(editTodo);
    setIsUpdate(true);
    setCurrentId(id);
  };

  return (
    <>
      <div className="d-flex justify-content-center min-vh-100 bg-light">
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="p-4 rounded shadow bg-white" style={{ width: "700px" }}>
          <h3 className="text-center mb-4 bg-primary bg-light-text p-2">
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
              <button className="btn btn-primary" onClick={handleUpdate}>
                Update
              </button>
            )}
          </div>
          <hr />
          <div className="bg-light pb-2">
            {todos.length > 0 ? (
              <ul className="list-group">
                <h2 className="text-center p-1 bg-warning rounded-top">
                  TODO List
                </h2>
                {todos.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className="list-group-item  justify-content-between d-flex ms-2 me-2 align-items-center"
                    >
                      <div>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={finished.includes(item)}
                          onChange={() =>
                            handleToggle(item, finished.includes(item))
                          }
                        />
                        &nbsp;&nbsp;
                        {item}
                      </div>
                      <div className="me-2">
                        <button
                          className="btn btn-sm  btn-primary me-2"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(index, false)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted text-center">No tasks added yet</p>
            )}
          </div>

          <div className="bg-light pb-2">
            {finished.length > 0 ? (
              <ul className="list-group">
                <h2 className="text-center p-1 bg-success rounded-top">
                  Finished List
                </h2>
                {finished.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item  justify-content-between d-flex ms-2 me-2 align-items-center"
                  >
                    <div>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={true}
                        onChange={() => handleToggle(item, true)}
                      />
                      &nbsp;&nbsp;
                      {item}
                    </div>
                    <div className="me-2">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(index, true)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
