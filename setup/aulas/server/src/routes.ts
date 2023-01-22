import dayjs from 'dayjs'
import { FastifyInstance} from 'fastify'
import { prisma } from "./lib/prisma"
import{ z } from 'zod' 


export async function appRoutes(app: FastifyInstance){
    app.post('/habits', async (request)=>{
        //a requisição do front-end para o back-end são 2 informaçõe
        //title,  weekDay
        const createHabitBody = z.object({
            title: z.string(),
            weekDay: z.array(
                z.number().min(0).max(6))
        })

        const {title, weekDay} = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({//esta criando um novo abito
            data:{
                title,
                created_at: today,//Pegando a data atual
                weekDays:{
                    create: weekDay.map(weekDay => {
                        return{
                            week_day: weekDay
                        }
                    })
                }
            }
        })
    })

    app.get('/day', async (request)=>{
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const { date } = getDayParams.parse(request.query)//http://localhost:3333/day?date=2022-01-13T00

        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day')

        const possibleHabnits = await prisma.habit.findMany({
            where:{
                created_at: {
                    lte: date,
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where:{
                date: parsedDate.toDate(),
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit =>{
            return dayHabit.habit_id
        })
        return{
            possibleHabnits, 
            completedHabits, 
        }
    })
}