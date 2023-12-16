import { HandPalm, Play } from "phosphor-react"
import { HomeContainer, StartCountdownButton, StopCountdownButton, } from "./styles"
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import { z } from "zod"
import { createContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm"
import { Countdown } from "./components/Countdown"
import {  } from "@mui/styled-engine-sc"
import BotaoTeste from "./components/BotaoTeste/Botao"

// criação da interface dos meus ciclos 
interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate ?: Date
}
interface CyclesContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    taskResolver: string | boolean | null,
}
interface TaskContext {
    handleStatusTask: (status: boolean) => void
}
// Criação do context
export const CyclesContext = createContext({} as CyclesContextType)
export const TaskContext = createContext({} as TaskContext)


export function Home () {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

    const [taskStatus, setTaskStatus] = useState<string | boolean | null>(false);

    //taskResolver para exibir no header do site
    const [taskResolver, setTaskResolver] = useState<string | null>('Começar Tarefa 🔴')
    document.title = `${taskResolver}`;

    // total de segundos
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)
    const [amountSecondsPassed, setAmountSecondsPassed ] = useState(0)

    // pegando os tipos com base nos exemplos do SCHEMA
    type formSchemaType = z.infer<typeof formSchema>;

    // Validação dos inputs do formulário
    const formSchema = z.object({
        task: z.string().min(1, 'Informe a tarefa'),
        minutesAmount: z
            .number()
            .min(1, 'O ciclo precisa ter no mínimo 1 minuto ')
            .max(60, 'O ciclo pode ter no máximo 60 minutos'),
    });

    //criação do meu schema padrão usando zod
    const newCycleForm = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })

    const { handleSubmit, watch, reset} = newCycleForm

    //Monitora se a task recebeu algum dado para liberar o botão
    const task = watch('task')
    const isSubmitDisabled = !task;

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        setCycles( state =>
            state.map((cycle) => {
                if (cycle.id == activeCycleId) {
                    return {...cycle, finishedDate: new Date()}
                } else {
                    return cycle
                }
            })
        )
        handleStatusTask(true);
        setActiveCycleId(null)
    }

    function handleStatusTask( status=false ) {
        setTaskStatus(status)
    }
    //função que gera o novo ciclo 
    function handleCreateNewCycle(data: formSchemaType)  {
        setTaskResolver(data.task);
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
        reset()
    }

    //função que interrompe o ciclo
    function handleInterruptCycle()  {
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
        <HomeContainer>
            <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed, taskResolver}}>
                <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    <Countdown />
                    { activeCycle ? (
                        <StopCountdownButton type="button" onClick={handleInterruptCycle}>
                            <HandPalm size={24} />
                            Interromper
                        </StopCountdownButton>
                    ): (
                        <StartCountdownButton  type="submit" disabled={isSubmitDisabled}>
                            <Play size={24} />
                            Começar
                        </StartCountdownButton>
                    )}
                </form>
            </CyclesContext.Provider>
            <TaskContext.Provider value={{handleStatusTask}}>
                <BotaoTeste taskStatus={taskStatus}/>
            </TaskContext.Provider>
        </HomeContainer>
    )
}