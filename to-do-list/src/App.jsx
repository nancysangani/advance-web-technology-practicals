import TodoApp from './TodoApp.jsx';

export default function App() {
  const defaultTask = [
    { text: "React Code", completed: false },
    { text: "Practice JavaScript", completed: false },
  ];
  return (
    <>
    <TodoApp title="My Daily Tasks" initialTasks={defaultTask}/>
    </>
  )
}