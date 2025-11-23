"use client"

import React, { useEffect, useState } from 'react'

const DEFAULT_DATA = {
	todo: [
		{ id: 't1', title: 'Draft landing page copy', owner: 'Alice', priority: 'High' },
		{ id: 't2', title: 'Create onboarding flow', owner: 'Carlos', priority: 'Medium' },
	],
	inprogress: [
		{ id: 't3', title: 'Integrate auth', owner: 'Maya', priority: 'High' },
	],
	review: [
		{ id: 't4', title: 'Review payment provider research', owner: 'Sam', priority: 'Low' },
	],
	done: [
		{ id: 't5', title: 'Set up repo', owner: 'DevOps', priority: 'Low' },
	],
}

function useLocalStorage(key, initial) {
	const [state, setState] = useState(() => {
		try {
			const raw = localStorage.getItem(key)
			return raw ? JSON.parse(raw) : initial
		} catch (e) {
			return initial
		}
	})

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(state))
		} catch (e) {}
	}, [key, state])

	return [state, setState]
}

export default function KanbanBoard({ initial }) {
	const [columns, setColumns] = useLocalStorage('kanban-columns', initial || DEFAULT_DATA)
	const [dragging, setDragging] = useState(null)
	const [hoveredColumn, setHoveredColumn] = useState(null)

	function onDragStart(e, fromColumn, taskId) {
		e.dataTransfer.setData('text/plain', JSON.stringify({ fromColumn, taskId }))
		e.dataTransfer.effectAllowed = 'move'
		setDragging({ fromColumn, taskId })
	}

	function onDragOver(e) {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
	}

	function onDrop(e, toColumn) {
		e.preventDefault()
		try {
			const payload = JSON.parse(e.dataTransfer.getData('text/plain'))
			const { fromColumn, taskId } = payload
			if (!taskId) return

			if (fromColumn === toColumn) {
				setDragging(null)
				return
			}

			setColumns(prev => {
				const sourceList = Array.from(prev[fromColumn] || [])
				const idx = sourceList.findIndex(t => t.id === taskId)
				if (idx === -1) return prev
				const [task] = sourceList.splice(idx, 1)
				const destList = Array.from(prev[toColumn] || [])
				destList.unshift(task)
				return { ...prev, [fromColumn]: sourceList, [toColumn]: destList }
			})
		} catch (err) {
			// ignore
		} finally {
			setDragging(null)
		}
	}

	function addTask(column, title) {
		if (!title) return
		const id = 't' + Math.random().toString(36).slice(2, 9)
		const task = { id, title, owner: '', priority: 'Medium' }
		setColumns(prev => ({ ...prev, [column]: [task, ...(prev[column] || [])] }))
	}

	function removeTask(column, id) {
		setColumns(prev => ({ ...prev, [column]: prev[column].filter(t => t.id !== id) }))
	}

	const colOrder = [
		{ key: 'todo', label: 'To Do' },
		{ key: 'inprogress', label: 'In Progress' },
		{ key: 'review', label: 'Review' },
		{ key: 'done', label: 'Done' },
	]

	return (
		<div className="w-full">
			<div className="flex items-center justify-between mb-4 ">
				<h2 className="text-xl font-semibold text-black">Kanban Board</h2>
				<div className="text-sm text-gray-500">Drag tasks between columns. Changes persist in localStorage.</div>
			</div>

			<div className="flex gap-4 overflow-x-auto pb-4">
				{colOrder.map(col => (
					<div key={col.key} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-sm border">
						<div className="px-4 py-3 border-b flex items-center justify-between bg-gray-50">
							<div className="font-medium text-black flex items-center">
								<span className="text-sm text-gray-500 mr-2">{col.label}</span>
							</div>
							<div className="text-xs text-black bg-gray-200 px-2 py-0.5 rounded-full">{(columns[col.key] || []).length}</div>
						</div>

						<div
							className={`p-3 min-h-[220px] max-h-[70vh] overflow-auto transition-colors ${hoveredColumn === col.key ? 'ring-2 ring-[#EF4444]/30 bg-white' : 'bg-[rgba(250,250,250,0.95)]'}`}
							onDragOver={onDragOver}
							onDragEnter={e => { e.preventDefault(); setHoveredColumn(col.key) }}
							onDragLeave={() => setHoveredColumn(null)}
							onDrop={e => { onDrop(e, col.key); setHoveredColumn(null) }}
							aria-label={`${col.label} column`}
							role="list"
						>
							<AddTaskInput onAdd={title => addTask(col.key, title)} placeholder={`Add to ${col.label}`} />

							<div className="mt-3 space-y-3 ">
								{(columns[col.key] || []).length === 0 && (
									<div className="text-sm text-gray-500 py-6 text-center">No tasks — drag here or add one.</div>
								)}

								{(columns[col.key] || []).map(task => (
									<div
										key={task.id}
										draggable
										onDragStart={e => onDragStart(e, col.key, task.id)}
										className={`bg-white rounded p-3 shadow-sm border cursor-move transition-shadow hover:shadow-lg flex items-start justify-between ${dragging && dragging.taskId === task.id ? 'opacity-70' : ''}`}
										role="listitem"
										aria-grabbed={dragging && dragging.taskId === task.id}
									>
										<div className="flex items-start gap-3">
											<span className={`inline-block w-2 h-2 rounded-full mt-1 ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'}`} />
											<div>
												<div className="font-medium text-black">{task.title}</div>
												<div className="text-xs text-gray-500">{task.owner || '—'} • {task.priority}</div>
											</div>
										</div>
										<div className="flex flex-col items-end gap-2">
											<button onClick={() => removeTask(col.key, task.id)} className="text-xs text-red-500">Remove</button>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

function AddTaskInput({ onAdd, placeholder }) {
	const [val, setVal] = useState('')
	return (
		<div className="flex gap-2">
			<input value={val} onChange={e => setVal(e.target.value)} placeholder={placeholder} className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black placeholder:text-gray-500 placeholder:opacity-90 bg-white" />
			<button
				onClick={() => {
					onAdd(val.trim())
					setVal('')
				}}
				className="px-2 py-1 bg-[#EF4444] text-white rounded text-sm"
			>
				Add
			</button>
		</div>
	)
}
