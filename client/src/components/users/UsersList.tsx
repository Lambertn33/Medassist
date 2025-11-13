import type { IUser } from '@/interfaces/users/IUser';
import { TableSearch, Loader, Button } from '@/components';
import { formatDateTime } from '@/utils';

interface UsersListProps {
  users: IUser[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  error?: Error | null;
  onUpdateAccountStatus: (id: number) => void;
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-800';
    case 'DOCTOR':
      return 'bg-blue-100 text-blue-800';
    case 'NURSE':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getAccountStatusBadgeColor = (account_status: string) => {
  switch (account_status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'CLOSED':
      return 'bg-red-100 text-red-800';
  }
};  
export const UsersList = ({ 
  users, 
  searchValue, 
  onSearchChange, 
  isLoading = false,
  error,
  onUpdateAccountStatus
}: UsersListProps) => {

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="my-4 mx-6 flex justify-end">
          <TableSearch value={searchValue} onChange={onSearchChange} />
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                Name
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Email
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Role
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Account Status
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Last Login
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Number of Encounters
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8">
                  <Loader message="Loading users..." />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <p className="text-red-500 font-medium">
                    {error instanceof Error ? error.message : 'An unexpected error occurred'}
                  </p>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                  <p className="text-gray-500 text-lg">No users found</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white hover:bg-blue-50 transition-colors"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {user.name}
                  </th>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getAccountStatusBadgeColor(user.account_status)}`}>
                      {user.account_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {user.last_login_at ? formatDateTime(user.last_login_at) : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {user.encounters_count}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {
                      user.role === 'ADMIN' ? null : (
                        <Button 
                          disabled={false}
                          type="button"
                          loading={false}
                          onClick={() => onUpdateAccountStatus(user.id)}
                          className={`px-4 py-2 rounded-sm text-xs ${user.account_status === 'ACTIVE' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors font-medium`}
                        >
                          {user.account_status === 'ACTIVE' ? 'Close Account' : 'Open Account'}
                        </Button>
                      )
                    }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

