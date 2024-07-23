// Importação de módulos e contextos necessários
import { ReactNode, createContext, useContext, useState } from "react";
import { TaskContext } from "../pages/Home";

// Definição de tipos para as propriedades e estados
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
    handleStatusTask: (minutes: unknown, seconds: unknown )=> void
}

// Criação do contexto CyclesContext
export const CyclesContext = createContext({} as CyclesContextType)

interface CycleContextProviderProps {
    children: ReactNode
}

// Função de provedor do contexto CyclesContext
export function CyclesContextProvider({children}: CycleContextProviderProps) {

    // Estados para exibir a tarefa no cabeçalho do site
    const [headerMinutes, setHeaderMinutes] = useState<unknown>(0)
    const [headerSeconds, setHeaderSeconds] = useState<unknown>(0)
    const [headerTimer, setHeaderTimer] = useState<unknown>(0)
    const [taskResolver, setTaskResolver] = useState<string | number | null>('Começar Tarefa')
    document.title = `${taskResolver}`;
    

    // Estado para armazenar os ciclos
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

    // Estado para armazenar a quantidade de segundos passados
    const [amountSecondsPassed, setAmountSecondsPassed ] = useState(0)

    // Encontrar o ciclo ativo com base no activeCycleId
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    // Estado para indicar se a tarefa foi concluída
    const [taskFinished, setTaskFinished] = useState(false)

    // Função para definir se a tarefa foi concluída
    function handleTaskFinished (status: boolean){
        setTaskFinished(status)
    }

    // Função para definir a quantidade de segundos passados
    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }
    
    // Função para definir o status da tarefa (minutos e segundos)
    function handleStatusTask (minutes: unknown, seconds : unknown) {
        setHeaderMinutes(minutes)
        setHeaderSeconds(seconds)
    }

    // Função para marcar o ciclo atual como concluído
    function markCurrentCycleAsFinished() {
        setCycles(state =>
            state.map((cycle) => {
                if (cycle.id == activeCycleId) {
                    handleTaskFinished(true)
                    setTaskResolver('🟢 Ciclo completo')
                    return {...cycle, finishedDate: new Date(), statusTask: true}
                    
                } else {
                    return cycle
                }
            })
        )

        setActiveCycleId(null)
    }

    // Função para criar um novo ciclo
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
        setTaskResolver('🟠 Ciclo em andamento')
        setHeaderTimer(1)
    }

    // Função para interromper o ciclo atual
    function interruptCurrentCycle()  {
        setCycles(state => state.map(cycle => {
            if (cycle.id == activeCycleId) {
                setTaskResolver('🔴 Ciclo interrompido ')
                return {...cycle, interruptedDate: new Date()}
            } else {
                return cycle
            }
        }))
        setActiveCycleId(null)
    }

    // Retorna o provedor do contexto CyclesContext com os valores e funções necessários
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
