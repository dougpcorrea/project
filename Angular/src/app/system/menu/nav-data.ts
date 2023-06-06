import { environment } from "src/environments/environment";

let homeRoute = 'dashboard'

if (environment.production){
    homeRoute = '#'
}

export const navbarData = [
    {
        routeLink: '',
        icon: 'fal fa-home',
        label: 'Dashboard'
    },
    {
        routeLink: 'habits',
        icon: 'fal fa-light fa-analytics',
        label: 'Habits'
    },
    {
        routeLink: 'tasks',
        icon: 'fal fa-list',
        label: 'Tasks'
    },
    {
        routeLink: 'books',
        icon: 'fal fa-book',
        label: 'Books'
    },
    {
        routeLink: 'flash',
        icon: 'fal fa-graduation-cap',
        label: 'Cards'
    },
    {
        routeLink: homeRoute,
        icon: 'fal fa-address-book',
        label: 'Media'
    },
    {
        routeLink: 'settings',
        icon: 'fal fa-cog',
        label: 'Settings'
    },

];

export const Tasks = [
    { title: 'Inbox', icon: 'fal fa-inbox-in fa-lg'},
    { title: 'Today', icon: 'fal fa-calendar-day fa-lg'},
    { title: 'This week', icon: 'fal fa-calendar-week fa-lg'},
    { title: 'Overdue', icon: 'fal fa-calendar-exclamation fa-lg'},
    { title: 'Completed', icon: 'fal fa-check-square fa-lg'}
]

export const Books = [
    { title: 'Bookshelf', icon: 'fal fa-books'},
    { title: 'Search book', icon: 'far fa-search fa-sm'},

]

export const Genre = [
    { title: 'Fantasy', icon: 'fal fa-circle fa-lg'},
    { title: 'Science Fiction', icon: 'fal fa-circle fa-lg'},
    { title: 'Biography', icon: 'fal fa-circle fa-lg'},
    { title: 'Dystopian', icon: 'fal fa-circle fa-lg'},
    { title: 'Adventure', icon: 'fal fa-circle fa-lg'},
    { title: 'Romance', icon: 'fal fa-circle fa-lg'},
    { title: 'Development', icon: 'fal fa-circle fa-lg'},
]

export const Projects = [
    { title: 'Project', icon: 'fal fa-circle fa-lg'},
    { title: 'Professional', icon: 'fal fa-circle fa-lg'},
    { title: 'Tweets' , icon: 'fal fa-circle fa-lg'},
    { title: 'Grocery', icon: 'fal fa-circle fa-lg'},
    { title: 'Buys', icon: 'fal fa-circle fa-lg'},
]

export const Habits = [
    { title: 'Tracker', icon: 'fal fa-chart-line'},
    { title: 'Analytics', icon: 'fal fa-light fa-analytics'},
]
