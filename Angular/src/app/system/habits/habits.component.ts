import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HabitsService, Months } from './habits.service';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { DatePipe } from '@angular/common';
Chart.register(...registerables)

@Component({
    selector: 'app-habits',
    templateUrl: './habits.component.html',
    styleUrls: ['./habits.component.scss']
})

export class HabitsComponent implements OnInit {

    constructor(private HabitsService: HabitsService, private httpClient: HttpClient, private cdr: ChangeDetectorRef) { }

    @ViewChild('habitsTable') habitsTable!: ElementRef;
    @ViewChild('barGraph', { static: true }) barGraph!: ElementRef;

    dataSource: any
    habits: any[] = [];
    displayedDates: string[] = [];
    weekData: any = [];
    show = false;
    completed!: any;
    average!: any;
    months = Months
    currentMonth!: number

    ngOnInit() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;


        this.HabitsService.getHabits().subscribe(res => {
            this.habits = res;

            this.HabitsService.getProgress().subscribe(res => {
                this.dataSource = res;
                this.show = true;
                this.changeMonth(currentMonth, 0)
            });

        });
    }

    weekFilter(start: Date, end: Date, chain: number) {
        console.log(start, end)
        let previousSeven = start.toISOString().split('T')[0];
        let currentDate = end.toISOString().split('T')[0];
        console.log(previousSeven, currentDate)

        const complete = this.dataSource
            .filter((data: any) => data.date <= currentDate && data.date >= previousSeven)
            .reduce((countObj: { [x: string]: any; }, item: { date: string; completed: number; }) => {
                const date = item.date;
                countObj[date] = (countObj[date] || 0) + ((item.completed === 1 || item.completed === 2) ? 1 : 0);
                return countObj;
            }, {});

        const today = this.dataSource
            .filter((data: any) => data.date == currentDate)
            .reduce((countObj: { [x: string]: any; }, item: { date: string; completed: number; }) => {
                const date = item.date;
                countObj[date] = (countObj[date] || 0) + ((item.completed === 1 || item.completed === 2) ? 1 : 0);
                return countObj;
            }, {});

        const values = Object.values(today);

        const datePipe = new DatePipe('en-US');

        // Sort the keys of the complete object by date in ascending order
        const sortedKeys = Object.keys(complete).sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());

        // Clear the global array before updating
        this.weekData.length = 0;

        let totalComplete = 0

        // Iterate over the sorted keys
        sortedKeys.forEach((date: string) => {
            const count = complete[date];
            const weekday = datePipe.transform(date, 'd');
            const average = (count / 11) * 100

            totalComplete = totalComplete + count

            this.weekData.push({ date: weekday, completed: count, average: average });
        });

        this.completed = totalComplete
        this.average = (totalComplete / 31 / 11 * 100).toFixed(0)

        this.loadCanvas(Object.keys(this.weekData).length, chain)

    }

    loadCanvas(lenght: number, chain: number) {
        try {
            const _complete = Chart.getChart("complete");
            const _average = Chart.getChart("average");
            const _astolf = Chart.getChart("Astolf");
            const _underground = Chart.getChart("Undergournd");

            if (chain === 1) {
                if (_complete) {
                    _complete.data.datasets[0].data = this.weekData.map((data: any) => data.completed);
                    _complete.data.labels = this.weekData.map((data: any) => data.date);

                    _complete.update();
                }

                if (_average) {
                    _average.data.datasets[0].data = this.weekData.map((data: any) => (data.average.toFixed(2)))
                    _average.data.labels = this.weekData.map((data: any) => data.date);
                    _average.update();
                }

            return
            } else {
                _complete?.destroy()
                _average?.destroy()
                _astolf?.destroy()
                _underground?.destroy()
            }
        } catch { }

        let chartConfig_1: any = {
            type: 'bar',
            data: {
                labels: this.weekData.map((data: any) => data.date),
                datasets: [{
                    label: '',
                    data: this.weekData.map((data: any) => data.completed),
                    backgroundColor: '#fdd380',
                    borderColor: '#fcb62b',
                    pointRadius: 1,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                responsive: true,
                scales: {
                    y: {
                        display: false,
                        grid: {
                            display: true
                        },
                    },
                    x: {
                        display: false, // Hide x-axis labels
                        grid: {
                            display: false
                        }
                    },
                }
            }
        }

        let chartConfig_2: any = {
            type: 'line',
            data: {
                labels: this.weekData.map((data: any) => data.date),
                datasets: [{
                    label: '',
                    data: this.weekData.map((data: any) => (data.average.toFixed(2))),
                    backgroundColor: '#fdd380',
                    borderColor: '#fcb62b',
                    pointRadius: 4,
                    fill: true,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                responsive: true,
                scales: {
                    y: {
                        display: false,
                        grid: {
                            display: true
                        },
                    },
                    x: {
                        display: false,
                        grid: {
                            display: false
                        }
                    },
                }
            }
        }

        if (lenght > 15) {
            chartConfig_2.data.datasets[0].pointRadius = 1;
        }

        chartConfig_2.data.datasets.pointRadius = 1
        chartConfig_2.data.datasets.fill = false

        const complete = new Chart("complete", chartConfig_1);

        const average = new Chart("average", chartConfig_2);
        
        const Astolf = new Chart("Astolf", chartConfig_1);
        const Underground = new Chart("Undergournd", chartConfig_2);
        
    }

    getHabitProgress(habit: number, date: string): number {
        if (this.dataSource) { // Check if dataSource is defined
            const habitProgress = this.dataSource.find((data: { habit: number; date: string; }) => data.habit === habit && data.date === date);

            if (habitProgress) {
                return habitProgress.completed;
            }
        }
        return 0;
    }

    formatDate(date: string): string {
        const parsedDate = new Date(date);
        parsedDate.setDate(parsedDate.getDate() + 1);
        const day = parsedDate.getDate();
        return day.toString();
    }

    onClick(event: any) {
        let date = event.target.querySelector('.date').attributes.id.nodeValue
        let habit = event.target.querySelector('.habit').attributes.id.nodeValue
        let completed = event.target.querySelector('.completed').attributes.id.nodeValue

        if (completed == 0) {
            event.target.querySelector('.completed').attributes.id.nodeValue = 1
            completed = 1
            event.target.querySelector('i').classList.remove('fal', 'fa-square', 'gray')
            event.target.querySelector('i').classList.add('fad', 'fa-check-square', 'green')
        }
        else if (completed == 1) {
            event.target.querySelector('.completed').attributes.id.nodeValue = 2
            completed = 2
            event.target.querySelector('i').classList.remove('fa-check-square', 'green')
            event.target.querySelector('i').classList.add('fa-minus-square', 'yellow')
        }
        else if (completed == 2) {
            event.target.querySelector('.completed').attributes.id.nodeValue = 3
            completed = 3
            event.target.querySelector('i').classList.remove('fa-minus-square', 'yellow')
            event.target.querySelector('i').classList.add('fa-times-square', 'red')
        }
        else if (completed == 3) {
            event.target.querySelector('.completed').attributes.id.nodeValue = 0
            completed = 0
            event.target.querySelector('i').classList.remove('fad', 'fa-times-square', 'red')
            event.target.querySelector('i').classList.add('fal', 'fa-square', 'gray')
        }

        this.HabitsService.postProgress(habit, date, completed)

        try {
            const i = this.dataSource.findIndex(function (x: { date: any; habit: any }) { return x.date == date && x.habit == habit })
            this.dataSource[i].completed = completed
        } catch {
            this.dataSource.push(date, completed, habit)
        }

        this.changeMonth(this.currentMonth, 1)
    }

    changeMonth(month: any, chain: number) {
        this.currentMonth = month
        const year = new Date().getFullYear(); // Get the current year

        // Calculate the start date of the specified month
        const startDate = new Date(year, month - 1, 1);

        // Calculate the end date of the specified month
        const endDate = new Date(year, month, 0);

        this.weekFilter(startDate, endDate, chain)

        const displayedDates: string[] = [];

        while (startDate <= endDate) {
            const year = startDate.getFullYear();
            const month = startDate.getMonth() + 1;
            const day = startDate.getDate();

            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            displayedDates.push(formattedDate);

            startDate.setDate(startDate.getDate() + 1); // Increment the start date by 1 day
        }

        this.displayedDates = displayedDates;
        console.log(this.displayedDates)
    }

}
