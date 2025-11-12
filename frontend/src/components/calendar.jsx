import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  border-radius: 8px;
  overflow: hidden;
  background: #d1dff0;
`;

const CalendarHeader = styled.div`
  
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const NavigationButton = styled.button`
  background: none;
  border: 1px solid rgba(0, 0, 0, 1);
  padding: 8px 12px;
  border-radius: 100%;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e9e9e9;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const MonthYear = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5em;
  font-weight: normal;
 
`;

const TodayButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-top: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: #1976d2;
    transform: scale(1.05);
  }
`;

const CalendarContent = styled.div`
  position: relative;
  overflow: hidden;
`;

const CalendarView = styled.div`
  animation: ${props => {
    if (props.$direction === 'next') return slideInFromRight;
    if (props.$direction === 'prev') return slideInFromLeft;
    return 'none';
  }} 0.3s ease-out;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Day = styled.div`
  padding: 10px;
  text-align: center;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
  height: 8px;
  width: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background: white;
  
  &:hover {
    background-color: #f0f0f0;
    transform: scale(1.05);
  }
  
  ${props => props.$isToday && `
    background-color: #e8f4fd;
    font-weight: bold;
    border-color: #2196f3;
    color: #1976d2;
  `}
  
  ${props => props.$isSelected && `
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
  `}
  
  ${props => props.$isOtherMonth && `
    color: #999;
    background-color: #f5f5f5;
    opacity: 0.6;
  `}
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  padding: 15px 20px;
  background: #D1DFF0;
  border-radius: 8px;
`;

const WeekDayHeader = styled.div`
  text-align: center;
  font-weight: bold;
  color: #666;
  font-size: 0.8em;
  padding: 5px 0;
  text-transform: uppercase;
`;

const WeekDay = styled.div`
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  height: 16px;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background: #ffffff;
  margin: 0 auto;
  font-size: 0.9em;
  
  &:hover {
    background-color: #f0f0f0;
    transform: scale(1.05);
  }
  
  ${props => props.$isToday && `
    background-color: #e8f4fd;
    font-weight: bold;
    border: 1px solid #2196f3;
    color: #1976d2;
  `}
  
  ${props => props.$isSelected && `
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
  `}
  
  ${props => props.$isOtherMonth && `
    color: #999;
    background-color: #f5f5f5;
    opacity: 0.6;
  `}
`;

const MonthIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9em;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

const HeaderOnlyContainer = styled.div`
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-radius: 8px;
  font-family: Arial, sans-serif;
`;

const WeekOnlyContainer = styled.div`
  background: #D1DFF0;
  border-radius: 8px;
  padding: 15px 20px;
  font-family: Nunito, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const WeekDayInitialsHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 10px;
`;

const WeekDayInitial = styled.div`
  text-align: center;
  font-weight: bold;
  color: #666;
  font-size: 0.9em;
  padding: 5px 0;
`;

const WeekDayName = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
 
`;

const FormattedDate = styled.div`
  font-size: 1em;
  color: #666;
`;

export function Calendar({ variant = 'default' }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [animationDirection, setAnimationDirection] = useState(null);
  const [showMonthIndicator, setShowMonthIndicator] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const getWeekDayName = (date) => {
    const weekDays = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return weekDays[date.getDay()];
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    setAnimationDirection(null);
  };

  const navigateMonth = (direction) => {
    setAnimationDirection(direction);
    
    setTimeout(() => {
      setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        if (direction === 'next') {
          newDate.setMonth(prevDate.getMonth() + 1);
        } else {
          newDate.setMonth(prevDate.getMonth() - 1);
        }
        return newDate;
      });
      
      setShowMonthIndicator(true);
      setTimeout(() => setShowMonthIndicator(false), 800);
    }, 150);
  };

  const navigateWeek = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'next') {
        newDate.setDate(prevDate.getDate() + 7);
      } else {
        newDate.setDate(prevDate.getDate() - 7);
      }
      return newDate;
    });
  };


const navigateDay = (direction) => {
  setAnimationDirection(direction);
  
  setTimeout(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'next') {
        newDate.setDate(prevDate.getDate() + 1); 
      } else {
        newDate.setDate(prevDate.getDate() - 1);
      }
      return newDate;
    });
    
    setShowMonthIndicator(true);
    setTimeout(() => setShowMonthIndicator(false), 800);
  }, 150);
};

  const handleDayClick = (day, isPreviousMonth = false, isNextMonth = false) => {
    let selected;
    
    if (isPreviousMonth) {
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
      selected = prevMonth;
      setCurrentDate(prevMonth);
    } else if (isNextMonth) {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      selected = nextMonth;
      setCurrentDate(nextMonth);
    } else {
      selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    }
    
    setSelectedDate(selected);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        navigateMonth('next');
      } else {
        navigateMonth('prev');
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonthDays = (date) => {
    const firstDayOfMonth = getFirstDayOfMonth(date);
    const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const daysInPreviousMonth = getDaysInMonth(previousMonth);
    
    const previousMonthDays = [];
    
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      previousMonthDays.push(daysInPreviousMonth - i);
    }
    return previousMonthDays;
  };

  const getNextMonthDays = (date, currentMonthDaysCount) => {
    const totalCells = 42;
    const nextMonthDays = [];
    const daysToAdd = totalCells - (getFirstDayOfMonth(date) + currentMonthDaysCount);
    
    for (let i = 1; i <= daysToAdd; i++) {
      nextMonthDays.push(i);
    }
    return nextMonthDays;
  };

  const isToday = (day, isPreviousMonth = false, isNextMonth = false) => {
    const today = new Date();
    
    if (isPreviousMonth) {
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
      return (
        day === today.getDate() &&
        prevMonth.getMonth() === today.getMonth() &&
        prevMonth.getFullYear() === today.getFullYear()
      );
    }
    
    if (isNextMonth) {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      return (
        day === today.getDate() &&
        nextMonth.getMonth() === today.getMonth() &&
        nextMonth.getFullYear() === today.getFullYear()
      );
    }
    
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day, isPreviousMonth = false, isNextMonth = false) => {
    if (isPreviousMonth) {
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
      return (
        day === selectedDate.getDate() &&
        prevMonth.getMonth() === selectedDate.getMonth() &&
        prevMonth.getFullYear() === selectedDate.getFullYear()
      );
    }
    
    if (isNextMonth) {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      return (
        day === selectedDate.getDate() &&
        nextMonth.getMonth() === selectedDate.getMonth() &&
        nextMonth.getFullYear() === selectedDate.getFullYear()
      );
    }
    
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return (
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentDay = () => {
  const today = new Date();
  return (
    currentDate.getDate() === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear()
  );
};

  const getNextMonthName = () => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(currentDate.getMonth() + 1);
    return monthNames[nextDate.getMonth()];
  };

  const getPrevMonthName = () => {
    const prevDate = new Date(currentDate);
    prevDate.setMonth(currentDate.getMonth() - 1);
    return monthNames[prevDate.getMonth()];
  };

  const getWeekDays = (date) => {
    const currentDay = date.getDay();
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() - currentDay);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      weekDays.push(day);
    }
    
    return weekDays;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    const previousMonthDays = getPreviousMonthDays(currentDate);
    previousMonthDays.forEach(day => {
      days.push(
        <Day 
          key={`prev-${day}-${currentDate.getMonth()}`}
          $isToday={isToday(day, true, false)}
          $isSelected={isSelected(day, true, false)}
          $isOtherMonth={true}
          onClick={() => handleDayClick(day, true, false)}
        >
          {day}
        </Day>
      );
    });

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <Day 
          key={`current-${day}-${currentDate.getMonth()}`}
          $isToday={isToday(day)}
          $isSelected={isSelected(day)}
          $isOtherMonth={false}
          onClick={() => handleDayClick(day, false, false)}
        >
          {day}
        </Day>
      );
    }

    const nextMonthDays = getNextMonthDays(currentDate, daysInMonth);
    nextMonthDays.forEach(day => {
      days.push(
        <Day 
          key={`next-${day}-${currentDate.getMonth()}`}
          $isToday={isToday(day, false, true)}
          $isSelected={isSelected(day, false, true)}
          $isOtherMonth={true}
          onClick={() => handleDayClick(day, false, true)}
        >
          {day}
        </Day>
      );
    });

    return days;
  };

const renderWeekDays = () => {
  return (
    <WeekGrid>
      {dayNames.map((dayName, index) => (
        <WeekDay
          key={`week-initial-${index}`}
          $isToday={false}
          $isSelected={false}
          $isOtherMonth={false}
        >
          {dayName}
        </WeekDay>
      ))}
    </WeekGrid>
  );
};

  if (variant === 'header-only') {
    return (
      <HeaderOnlyContainer>
        <NavigationButton 
          onClick={() => navigateDay('prev')}
          title={`Dia anterior: ${formatDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))}`}
        >
          ‹
        </NavigationButton>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <WeekDayName>
            {getWeekDayName(currentDate)}
          </WeekDayName>
          <FormattedDate>
            {formatDate(currentDate)}
          </FormattedDate>
          
          {!isCurrentDay() && (
            <TodayButton onClick={goToToday}>
              Hoje
            </TodayButton>
          )}
        </div>
        
        <NavigationButton 
          onClick={() => navigateDay('next')} 
        title={`Próximo dia: ${formatDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))}`}
        >
          ›
        </NavigationButton>

        <MonthIndicator $show={showMonthIndicator}>
          {animationDirection === 'next' ? getNextMonthName() : getPrevMonthName()}
        </MonthIndicator>
      </HeaderOnlyContainer>
    );
  }

if (variant === 'week-only') {
  return (
    <WeekOnlyContainer>
      {renderWeekDays()}
    </WeekOnlyContainer>
  );
}

  return (
    <CalendarContainer 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CalendarHeader>
        <NavigationButton 
          onClick={() => navigateMonth('prev')}
          title={`Mês anterior: ${getPrevMonthName()}`}
        >
          ‹
        </NavigationButton>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <MonthYear>
            {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
          </MonthYear>
          {!isCurrentMonth() && (
            <TodayButton onClick={goToToday}>
              Hoje
            </TodayButton>
          )}
        </div>
        
        <NavigationButton 
          onClick={() => navigateMonth('next')}
          title={`Próximo mês: ${getNextMonthName()}`}
        >
          ›
        </NavigationButton>

        <MonthIndicator $show={showMonthIndicator}>
          {animationDirection === 'next' ? getNextMonthName() : getPrevMonthName()}
        </MonthIndicator>
      </CalendarHeader>
      
      <CalendarContent>
        <CalendarView $direction={animationDirection}>
          <DaysGrid>
            {renderCalendarDays()}
          </DaysGrid>
        </CalendarView>
      </CalendarContent>
    </CalendarContainer>
  );
}