export const LOAN_MATURIES = {
	personal: [3, 6, 9, 12, 18, 24, 30, 36],
	newCar: [3, 6, 9, 12, 18, 24, 30, 36],
	mortgage: [3, 6, 9, 12, 18, 24, 30, 36],
};

  export const LOAN_TYPES = [
  { type: 'personal', name: 'İhtiyaç Kredisi', slug:'ihtiyac-kredisi', icon:'İhtiyaç Kredisi' },
  { type: 'newCar', name: 'Taşıt Kredisi', slug:'tasit-kredisi', icon:'Taşıt Kredisi'},
  { type: 'mortgage', name: 'Konut Kredisi', slug:'konut-kredisi', icon:'Konut Kredisi' }
 ]

 export const loanType = {
  'ihtiyac-kredisi':'personal',
  'tasit-kredisi':'newCar',
  'konut-kredisi':'mortgage'
 }
  export const loanTypeSlug = {
  'personal':'ihtiyac-kredisi',
  'newCar':'tasit-kredisi',
  'mortgage':'konut-kredisi'
 }

export const moneyFormatter =new Intl.NumberFormat('tr-TR', {
    minimumIntegerDigits: 1,
    useGrouping: true
  })

