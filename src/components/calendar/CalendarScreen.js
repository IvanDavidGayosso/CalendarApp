import React,{ useState, useEffect } from 'react';
import {  useSelector, useDispatch } from 'react-redux'; 
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import  'moment/locale/es';

import { Navbar } from '../ui/Navbar';
import { messages } from '../../helpers/calendar-messages-es';

import  'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es');

const localizer = momentLocalizer(moment); // or globalizeLocalizer

export const CalendarScreen = () => {
    
    const dispatch = useDispatch();
    const { events, activeEvent  } = useSelector(state => state.calendar);
    const [ lastView, setLastView ] = useState( localStorage.getItem('lastView') || 'month' );
    const { uid }  = useSelector( state => state.auth);

    useEffect(() => {
        dispatch( eventStartLoading() );
    }, [dispatch]);

    const onDoubleClick = (e) => {
        dispatch( uiOpenModal() );
    }

    const onSelectEvent = (e) => {
        dispatch( eventSetActive(e) );
    }

    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) =>{
        dispatch( eventClearActiveEvent() )
    }

    const eventStyleGetter = ( event, start, end, isSelected ) => {

        const style = {
            backgroundColor: ( uid === event.user._id ) ? '#367CF7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }

        return {
            style
        }
    }

    return (
        <div className="calendar-screen">
            <Navbar />
            
            
            <Calendar
                localizer={localizer}
                events={ events }
                startAccessor="start"
                endAccessor="end"
                messages={ messages }
                eventPropGetter={ eventStyleGetter }
                onDoubleClickEvent= { onDoubleClick }
                onSelectEvent= { onSelectEvent }
                onView= { onViewChange }
                onSelectSlot={ onSelectSlot }
                selectable= {true}
                view={ lastView }
                components={ {event: CalendarEvent} }
            />

            {
                (activeEvent) && <DeleteEventFab />
            }          

            <AddNewFab />
            
            <CalendarModal />
            
        </div>
    )
}