export const Link = ({ children }: { children: string | string[] }) => {
  return (
    <span class='border-b border-dashed border-transparent transition-colors duration-45 hover:border-primary hover:text-primary cursor-pointer'>
      {children}
    </span>
  )
}
