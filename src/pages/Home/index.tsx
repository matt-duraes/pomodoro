import { HandPalm, Play } from "phosphor-react"
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, StopCountdownButton, TaskInput} from "./styles"
import { useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import { z } from "zod"
import { useEffect, useState } from "react";
import { differenceInSeconds} from 'date-fns';
import { NewCycleForm } from "./components/NewCycleForm"
import { Countdown } from "./components/Countdown"

// Validação dos inputs do formulário
const formSchema = z.object({
    task: z.string().min(1, 'Informe a tarefa'),
    minutesAmount: z
        .number()
        .min(1, 'O ciclo precisa ter no mínimo 1 minuto ')
        .max(60, 'O ciclo pode ter no máximo 60 minutos'),
});

// pegando os tipos com base nos exemplos do SCHEMA
type formSchemaType = z.infer<typeof formSchema>;

// criação da interface dos meus ciclos 
interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date,
    interruptedDate?: Date,
    finishedDate ?: Date
}



export function Home () {

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

    //taskResolver para exibir no header do site
    const [taskResolver, setTaskResolver] = useState<string | null>(null)
    
    // total de segundos
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    //Monitora se a task recebeu algum dado para liberar o botão
    const task = watch('task')
    const isSubmitDisabled = !task;

    //função que gera o novo ciclo 
    const handleCreateNewCycle = (data: formSchemaType) => {
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
    const handleInterruptCycle = () => {
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
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <NewCycleForm />
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
        </HomeContainer>
    )
}