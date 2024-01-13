import { HandPalm, Play } from "phosphor-react"
import { HomeContainer, StartCountdownButton, StopCountdownButton, } from "./styles"
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import { z } from "zod"

import { NewCycleForm } from "./components/NewCycleForm"
import { Countdown } from "./components/Countdown"
import {  } from "@mui/styled-engine-sc"
import { createContext, useContext, useState } from "react"
import { CyclesContext } from "../../contexts/CyclesContext"
import BotaoTeste from "./components/BotaoTeste/Botao"

interface TaskContext {
    handleStatusTask: (status: boolean) => void
}
// criação da interface dos meus ciclos 
export const TaskContext = createContext({} as TaskContext)

export function Home () {

    const {createNewCycle, interruptCurrentCycle, activeCycle, taskFinished, handleTaskFinished} = useContext(CyclesContext)
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

    function handleStatusTask(status= false ) {
        handleTaskFinished(status)
    }
    
    function handleCreateNewCycle(data: formSchemaType ) {
        createNewCycle(data)
        reset()
    }

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />
                { activeCycle ? (
                    <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
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
            <TaskContext.Provider value={{handleStatusTask}}>
                <BotaoTeste taskStatus={taskFinished}/>
            </TaskContext.Provider>
        </HomeContainer>
    )
}