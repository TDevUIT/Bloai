'use client'
import dynamic from 'next/dynamic'

type Props = {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    'aria-labelledby'?: string;
}

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  {
    ssr: false, 
    loading: () => (
      <div className="h-[500px] w-full animate-pulse rounded-md border" />
    )
  }
)

export const EditorWrapper = ({ value, onChange, 'aria-labelledby': ariaLabelledby }: Props) => (
    <div data-color-mode="light">
        <MDEditor
            value={value}
            onChange={onChange}
            height={500}     
            preview="live"  
            aria-labelledby={ariaLabelledby}
        />
    </div>
);