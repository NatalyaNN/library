export default defineAppConfig({
   ui: {
      card: {
         slots: {
            // root: 'rounded-lg overflow-hidden',
            // header: 'p-4 sm:px-6',
            body: 'p-0 sm:p-0',
            // footer: 'p-4 sm:px-6'
         },
         variants: {
            variant: {
               solid: {
                  root: 'bg-inverted text-inverted'
               },
               outline: {
                  root: 'ring-1 ring-gray-200 dark:ring-gray-800'
               },
               soft: {
                  root: 'bg-elevated/50 divide-y divide-default'
               },
               subtle: {
                  root: 'bg-elevated/50 ring ring-default divide-y divide-default'
               }
            }
         },
         defaultVariants: {
            variant: 'outline'
         }
      }
   }
})
 