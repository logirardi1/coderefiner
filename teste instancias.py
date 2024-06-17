def soma ( a,b): return a+ b

  def subtracao(a, 
  b): 
  return a  -b
 def multiplicacao(a,b):return a*b

def divisao(a,
b):


 return a
/ b
def calculadora(operacao,a,b):
    if operacao=='soma':return soma(a,b
    )
        elif operacao== 'subtracao': return subtracao(a,b)
 elif operacao=='multiplicacao':
    return multiplicacao(a,
b)
 elif operacao=='divisao':
  return divisao(a,b)

else:return'Operacao
invalida'

print(calculadora('soma',
1,2))
print(
calculadora('subtracao', 5 ,3))
print(calculadora(
'multiplicacao', 2,2))
print(calculadora('divisao', 8,4))
print( calculadora('modulo', 9,3))