import { Spinner, SpinnerProps } from '@nextui-org/react';
export default function Loading(props: SpinnerProps ) {
  return (
    <div className="w-full flex justify-center items-center"><Spinner {...props}/></div>
  )
}
