import { useEffect, useState } from "react";
import NoTask from "./assets/images/no-task.svg?react";

import { TodoForm } from "./TodoForm";
import axios from "axios";

interface ITodo {
  id: number;
  name: string;
  description: string | null;
  priority: string;
  deadline: string | null;
  type: string;
  isDone: boolean;
}

const priorityColors = {
  high: "bg-red-100",
  medium: "bg-blue-100",
  low: "bg-green-100",
};
const chipPriorityColors = {
  high: "bg-red-400",
  medium: "bg-blue-400",
  low: "bg-green-400",
};

function App() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const openModal = () => {
    (
      document.getElementById("add_ceklis_modal") as HTMLDialogElement
    )?.showModal();
  };

  async function fetchValues() {
    setIsLoading(true);
    const valuesResp = await axios.get<ITodo[]>("/api/todos");
    setTodos(valuesResp.data);
    setIsLoading(false);
  }

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/todos/${id}`);
    fetchValues();
  };

  useEffect(() => {
    fetchValues();
  }, []);

  return (
    <>
      <div className="container mx-auto p-4 w-full max-w-xl min-h-screen">
        <div className="flex items-center justify-between py-4 mb-4">
          <h1 className="text-3xl font-logo leading-none">
            Ceklis<sup>&#x274D;</sup>
          </h1>
          {/* <button className="w-8 h-8 rounded-full bg-white text-black flex border-2 items-center justify-center text-2xl">
          
        </button> */}
          <button
            className="btn btn-outline text-2xl btn-circle"
            onClick={openModal}
          >
            &#x2723;
          </button>
        </div>

        <div className="mb-8">
          {/* <h2 className="text-xl font-semibold mb-2 underline">Ceklis harian</h2> */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
          {!isLoading && todos?.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <NoTask className="max-w-2/3 sm:max-w-1/2 h-fit" />
              <h2 className="text-xl leading-none">
                belum ada{" "}
                <span className="font-logo text-sm sm:text-base italic">
                  Ceklis.
                </span>{" "}
                <button
                  className="border-b hover:opacity-70 transition-opacity cursor-pointer"
                  onClick={openModal}
                >
                  tambah &#x2723;
                </button>
              </h2>
            </div>
          )}

          {todos.map((todo) => {
            const cardColor =
              priorityColors[
                todo.priority.toLowerCase() as keyof typeof priorityColors
              ] || "bg-white";

            const chipColor =
              chipPriorityColors[
                todo.priority.toLowerCase() as keyof typeof chipPriorityColors
              ] || "bg-white";

            return (
              <div
                key={todo.id}
                className={`border border-gray-300 rounded-md p-4 mb-4 flex flex-col gap-2 ${cardColor}`}
              >
                <h3 className="text-lg font-semibold">{todo.name}</h3>
                <p className="text-sm text-gray-600">{todo.description}</p>
                {todo.deadline && (
                  <p className="text-sm text-red-600">
                    Expired on: {new Date(todo.deadline).toLocaleDateString()}
                  </p>
                )}
                <div className="flex items-center gap-2 justify-between">
                  <span
                    className={`text-xs font-semibold uppercase px-2 py-1 rounded-full text-white ${chipColor}`}
                  >
                    {todo.priority.charAt(0).toUpperCase() +
                      todo.priority.slice(1)}
                  </span>

                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="bg-black text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TodoForm refetch={fetchValues} />
    </>
  );
}

export default App;
