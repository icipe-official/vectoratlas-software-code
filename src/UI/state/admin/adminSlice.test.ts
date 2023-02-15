import reducer, {
  adminLoading,
  changeUserRoles,
  initialState,
  savingRoles,
  usersWithRoles,
} from './adminSlice';

describe('adminSlice', () => {
  let state;

  beforeEach(() => {
    state = initialState();
  });

  it('sets the admin loading state', () => {
    expect(state.loading).toBeFalsy();
    const updatedState = reducer(state, adminLoading(true));
    expect(updatedState.loading).toBeTruthy();
  });

  it('sets the savingUser state', () => {
    expect(state.savingUser).toBeFalsy();
    const updatedState = reducer(state, savingRoles(true));
    expect(updatedState.savingUser).toBeTruthy();
  });

  it('sets users on state', () => {
    const updatedState = reducer(state, usersWithRoles('user roles'));
    expect(updatedState.users).toEqual('user roles');
  });

  describe('changeUserRoles', () => {
    it('updates roles for a matching user', () => {
      state.users = [
        {
          auth0_id: 'A',
          is_admin: false,
          is_uploader: false,
          is_reviewer: false,
          is_editor: false,
        },
        {
          auth0_id: 'B',
          is_admin: false,
          is_uploader: false,
          is_reviewer: false,
          is_editor: false,
        },
      ];

      const updatedUser = {
        auth0_id: 'A',
        is_admin: true,
        is_uploader: false,
        is_reviewer: true,
        is_editor: false,
      };
      const updatedState = reducer(state, changeUserRoles(updatedUser));

      expect(updatedState.users).toEqual([
        {
          auth0_id: 'A',
          is_admin: true,
          is_uploader: false,
          is_reviewer: true,
          is_editor: false,
        },
        {
          auth0_id: 'B',
          is_admin: false,
          is_uploader: false,
          is_reviewer: false,
          is_editor: false,
        },
      ]);
    });

    it('makes no changes if no matching user', () => {
      state.users = [
        {
          auth0_id: 'A',
          is_admin: false,
          is_uploader: false,
          is_reviewer: false,
          is_editor: false,
        },
      ];

      const updatedState = reducer(state, changeUserRoles({ auth0_id: 'C' }));

      expect(updatedState.users).toEqual(state.users);
    });
  });
});
