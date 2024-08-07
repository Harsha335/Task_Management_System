import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ').length > 1 ? name.split(' ')[1][0] : ''}`,
  };
}

type avatharPropsType = {
    name: string;
    email: string;
}
export default function UserAvathar({users} : {users:avatharPropsType[]}) {
  return (
    <AvatarGroup max={4}>
        {
            users.map((user, index) => (
                <div className='group relative'>
                    <Avatar {...stringAvatar(user.name.toUpperCase())} key={index} />
                    <span className='group-hover:flex flex-col p-2 hidden absolute bottom-10 right-0 bg-white rounded-lg border-2 border-black'>
                        <span className='flex flex-row items-center gap-1'>
                            <span><Avatar {...stringAvatar(user.name.toUpperCase())} key={index} /> </span>
                            <span>{user.name}</span>
                        </span>
                        <span className='flex flex-row gap-2'>
                            <span className='font-semibold text-nowrap'>Email Address</span>
                            <span >{user.email}</span>
                        </span>
                    </span>
                </div>
            ))
        }
    </AvatarGroup>
  );
}