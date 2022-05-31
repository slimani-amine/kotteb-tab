import {  useState, SetStateAction } from 'react'
import { MdiFountainPen,  MdiLightDelete} from '../Icons'
import {v4 as uuid} from 'uuid'
import { useLocalStorage } from '../Hooks';

interface todos {
	todo: string;
	checked: boolean;
	id: string;
}

export const Todos = () => {
	const [openModal, setOpenModal] = useState<Boolean>(false)

	const [todo, setTodo] = useState<string>('')

	const [val, setVal]  = useLocalStorage('todos', '')

	const todos = val as unknown as todos[]
	const setTodos = setVal as unknown as React.Dispatch<SetStateAction<todos[]>>

	const saveTodo = () => {
		if(todo==='')return
		setTodos([...todos, {todo, checked: false, id: uuid()}])
		setTodo('')
	}

	const handleCheckbox = (id: string) => {
		setTodos((prev) => 
			prev.map(todo => 
				todo.id===  id ? ({...todo, checked: !todo.checked}): todo
			)
		)
	}

	const deleteTodo = (id: string) => {
		setTodos(prev  => prev.filter(todo => todo.id !== id))
	}


	return (
		<div className={`${openModal && "w-full" } flex justify-between self-end h-full`}>
				{openModal && (
					<div className='bg-inherit backdrop-blur-xl w-full m-4 h-3/4 mt-5 p-4 flex flex-col justify-between'>
						<div className='flex flex-col '>
							{todos && todos?.map((t, idx) =>(
								<div className='mb-4'>
									<label className='text-slate-300 text-lg' key={idx}>
										<input className='mr-3' type="checkbox" checked={t.checked} onChange={() => handleCheckbox(t.id)} />
										{t.checked ? <s>{t.todo}</s> : <span>{t.todo}</span>}
									</label>
									<MdiLightDelete onClick={() => deleteTodo(t.id)} className="inline ml-2"/>
								</div>
							))}
						</div>
						<label htmlFor='todo' className='text-slate-300 '>
							<span className='text-xl'>Todo: </span>
							<input id='todo' className='text-black text-lg p-1 bg-slate-300 w-1/2' value={todo} name="todo" onChange={e => setTodo(e.target.value)}/>
							<button className='text-lg px-6 py-1 text-black bg-slate-300 ml-4' onClick={saveTodo}>Save</button>
							<button className='text-lg px-4 py-1 text-black bg-slate-300 ml-4' onClick={() => setTodos([])}>Clear All</button>
						</label>
					</div>
				)}
			<MdiFountainPen
				width='1.5rem'
				height='1.5rem'
				className='mt-5 mr-5 cursor-pointer'
				onClick={() => setOpenModal(prev => !prev)}
			/>
		</div>
	)
}
