import { z } from "zod";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles"
import { zodResolver} from '@hookform/resolvers/zod'

export const NewCycleForm = () => {
    
    // Validação dos inputs do formulário
    const formSchema = z.object({
        task: z.string().min(1, 'Informe a tarefa'),
        minutesAmount: z
            .number()
            .min(1, 'O ciclo precisa ter no mínimo 1 minuto ')
            .max(60, 'O ciclo pode ter no máximo 60 minutos'),
    });


    //criação do meu schema padrão usando zod
    const {register, handleSubmit, watch, reset}  = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })
    //Monitora se a task recebeu algum dado para liberar o botão
    const task = watch('task')
    const isSubmitDisabled = !task;
    return (
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
                step={1}
                min={1}
                max={60}
                {...register('minutesAmount', {valueAsNumber: true})}
            />
            <span>minutos.</span>
        </FormContainer>
    )
}