import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import AboutContact from './aboutContact';

describe(AboutContact.name, () => {
  it('displays the dummy data correctly', () => {
    render(<AboutContact />);
    expect(screen.getByText('Lan M. Medina')).toBeVisible();
    expect(screen.getByText('Kenya')).toBeVisible();
    expect(screen.getByText('Postdoctoral Fellow, Molecular Biology, Bioinformatics and Biostatistics')).toBeVisible();
    expect(screen.getByText('Christine H. Garza')).toBeVisible();
    expect(screen.getByText('Uganda')).toBeVisible();
    expect(screen.getByText('Project Accounting Manager, Finance and Administration Department')).toBeVisible();
    expect(screen.getByText('Curtis R. Galvin')).toBeVisible();
    expect(screen.getByText('Rwanda')).toBeVisible();
    expect(screen.getByText('Visiting Scientist')).toBeVisible();
  });
  it('removes toDo item from list',() =>{
    const mockToDoList = [
      { id: 1, task: 'to do 1', isDone: false}]
    const setCheckStateMock = jest.fn()
    const deleteToDoMock = jest.fn()
    render(<AboutContact toDos={mockToDoList} setCheckState={setCheckStateMock} deleteToDo={deleteToDoMock}/>)
    screen.getByTestId('delete').click()
    expect(deleteToDoMock).toHaveBeenCalledTimes(1)
  });
})
