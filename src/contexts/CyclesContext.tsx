import { ReactNode, createContext, useContext, useState } from "react";
import { TaskContext } from "../pages/Home";

interface CreateCycleData {
    task: string
    minutesAmount: number
}

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate ?: Date
    statusTask ?: boolean
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    taskFinished ?: boolean
    handleTaskFinished: (status: boolean ) => void
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
    handleStatusTask: (minutes: any, seconds: any )=> void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CycleContextProviderProps {
    children: ReactNode
}

export function CyclesContextProvider({children}: CycleContextProviderProps) {

    //taskResolver para exibir no header do site
    const [headerMinutes, setHeaderMinutes] = useState<any>(0)
    const [headerSeconds, setHeaderSeconds] = useState<any>(0)
    const [taskResolver, setTaskResolver] = useState<string | number |null>('Começar Tarefa - Time: ')
    document.title = `${taskResolver} ${ headerMinutes+':'+headerSeconds}`;

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

    const [amountSecondsPassed, setAmountSecondsPassed ] = useState(0)

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    const [taskFinished, setTaskFinished] = useState(false)

    function handleTaskFinished (status: boolean){
        setTaskFinished(status)
    }

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }
    
    function handleStatusTask (minutes: any, seconds : any) {
        setHeaderMinutes(minutes)
        setHeaderSeconds(seconds)
    }

    function markCurrentCycleAsFinished() {
        setCycles( state =>
            state.map((cycle) => {
                if (cycle.id == activeCycleId) {
                    handleTaskFinished(true)
                    return {...cycle, finishedDate: new Date(), statusTask: true}
                } else {
                    return cycle
                }
            })
        )

        setActiveCycleId(null)
    }

    //função que gera o novo ciclo 
    function createNewCycle(data: CreateCycleData)  {
        const id = String(new Date().getTime());
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        setCycles(state => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassed(0)
        setTaskResolver(newCycle.task)
        // reset()
    }

    //função que interrompe o ciclo
    function interruptCurrentCycle()  {
        setCycles(state => state.map(cycle => {
            if (cycle.id == activeCycleId) {
                return {...cycle, interruptedDate: new Date()}
            } else {
                return cycle
            }
        })
        ),
        setActiveCycleId(null)
    }

    return (
        <CyclesContext.Provider value={{
            activeCycle,
            activeCycleId,
            amountSecondsPassed,
            taskFinished,
            cycles,
            markCurrentCycleAsFinished,
            setSecondsPassed,
            createNewCycle, 
            interruptCurrentCycle,
            handleStatusTask,
            handleTaskFinished,
            }}
        >
        {children}
        </CyclesContext.Provider>
    )
}