import { HandPalm, Play } from "phosphor-react"
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, StopCountdownButton, TaskInput} from "./styles"
import { useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import { z } from 'zod';
import { useEffect, useState } from "react";
import { differenceInSeconds} from 'date-fns';

// Validação dos inputs do formulário
const formSchema = z.object({
    task: z.string().min(1, 'Informa a tarefa'),
    minutesAmount: z
        .number()
        .min(5, 'O ciclo precisa ter no mínimo  5 minutos ')
        .max(60, 'O ciclo precisa ter no máximo 60 minutos'),
});

// pegando os tipos com base nos exemplos do SCHEMA
type formSchemaType = z.infer<typeof formSchema>;

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date,
    interruptedDate?: Date,
}

export function Home () {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    // total de segundos
    const [amountSecondsPassed, setAmountSecondsPassed ] = useState(0)
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

    useEffect(() => {
        let interval: number;
        if(activeCycle) {
            interval = setInterval(() => {
                setAmountSecondsPassed(
                    differenceInSeconds(new Date(),activeCycle.startDate))
            }, 1000)
        }
        return () => {
            clearInterval(interval)
        }
    },[activeCycle])


    const {register, handleSubmit, watch, reset}  = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })

    const handleCreateNewCycle = (data: formSchemaType) => {
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

    const handleInterruptCycle = () => {

        setCycles(cycles.map(cycle => {
            if (cycle.id == activeCycleId) {
                return {...cycle, interruptedDate: new Date()}
            } else {
                return cycle
            }
        })
        ),
        setActiveCycleId(null)
    }


    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds  % 60

    const task = watch('task')
    const isSubmitDisabled = !task;

    const minutes  =  String(minutesAmount).padStart(2, '0')
    const seconds  =  String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if (activeCycle) {
            document.title = `${task} - ${minutes}:${seconds}`

        }
    }, [minutes,seconds, activeCycle])
    console.log(cycles)
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput
                        id="task" 
                        placeholder="Dê um nome para o seu projeto"
                        list="task-suggestions"
                        disabled={!!activeCycle}
                        {...register('task')}
                    />
                    <datalist id="task-suggestions">
                        <option value="Projeto 1" />
                        <option value="Projeto 2" />
                        <option value="Projeto 3" />
                        <option value="" />
                    </datalist>
                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput
                        type="number" 
                        id="minutesAmount" 
                        placeholder="00"
                        disabled={!!activeCycle}
                        step={5}
                        min={5}
                        max={60}
                        {...register('minutesAmount', {valueAsNumber: true})}
                    />
                    <span>minutos.</span>
                </FormContainer>
                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

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