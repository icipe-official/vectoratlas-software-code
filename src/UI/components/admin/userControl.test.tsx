import { initialState } from "../../state/admin/adminSlice";
import { AppState } from "../../state/store";
import { areRolesDifferent, UserControl } from "./userControl"
import { fireEvent, render } from '../../test_config/render';

jest.mock('../../state/admin/actions/admin.actions', () => ({
  saveUserRoles: (c) => ({type: 'saveUserRoles-mock', payload: c})
}))

const buildUser = () => ({
  email: 'test user',
  auth0_id: 'user123',
  is_admin: false,
  is_uploader: false,
  is_reviewer: false,
  is_editor: false,
});

describe('areRolesDifferent', () => {
  it('returns true if any roles are different', () => {
    const user = buildUser();
    expect(areRolesDifferent(user, user)).toBeFalsy();

    let workingCopy = buildUser();
    workingCopy.is_admin = true;
    expect(areRolesDifferent(user, workingCopy)).toBeTruthy();

    workingCopy = buildUser();
    workingCopy.is_uploader = true;
    expect(areRolesDifferent(user, workingCopy)).toBeTruthy();

    workingCopy = buildUser();
    workingCopy.is_reviewer = true;
    expect(areRolesDifferent(user, workingCopy)).toBeTruthy();

    workingCopy = buildUser();
    workingCopy.is_editor = true;
    expect(areRolesDifferent(user, workingCopy)).toBeTruthy();
  })
})

describe('UserControl', () => {
  let state: Partial<AppState>;
  const user = buildUser();

  beforeEach(() => {
    state = {
      admin: initialState()
    }
  });

  it('renders correctly', () => {
    const { wrapper } = render(<UserControl user={user}/>, state);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('disables the save button if in the middle of saving', () => {
    state.admin.savingUser = true;
    const { wrapper } = render(<UserControl user={user}/>, state);

    expect(wrapper.getByRole('button')).toBeDisabled();
  })

  it('dispatches the right save action when clicked', () => {
    const { wrapper, store } = render(<UserControl user={user}/>, state);

    const checkboxes = wrapper.getAllByRole('checkbox');

    // check the editor role
    fireEvent.click(checkboxes[2]);

    // click save
    fireEvent.click(wrapper.getByRole('button'));

    const actions = store.getActions();
    const expectedUser = buildUser();
    expectedUser.is_editor = true;
    expect(actions[0]).toEqual({type: 'saveUserRoles-mock', payload: expectedUser});
  })
})