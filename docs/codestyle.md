## Common

- Use [TypeScript](https://www.typescriptlang.org/) language during development

- All local variables, function parameters should be named in `camelCase` style, without any special prefixes

- Specify `local variables`, `parameters` and `return value` types:
```typescript
function add(firstParam: number, secondParam: number) : number {
    const localVariable: number = firstParam + secondParam;
    return localVariable;
}
```

- All functions should be named in a `camelCase` style

- Use `const` for local variables that woudn't changes:
```typescript
function max(values: number[]) : number {
    let maxValue = values[0];
    for (let i = 0; i < values.length; ++i) {
        const v = values[i];
        if (v > maxValue)
            maxValue = v;
    }
    return maxValue;
}
```

- Prevent importing all from module. Where it possible use:
```typescript
import { Class1, Class2 } from './classes';
```

- Don't miss `;` symbol at the end of expressions

- Throw exceptions when it goes to wrong logic behavior. Use `throw 'string'` to throw any exception:
```typescript
if (...)
    throw "Undefined behavior"; // format string as you wish (but include some useful info about error)
```

## Classes

- All class members (not functions) should start with `_` prefix. And has a `camelCase` style name:
```typescript
class ExampleClass {
    private _exampleMember: number;
}
```

- Preffer to use `setter/getter` functionality (see `Accessors` section at [classes documentation](https://www.typescriptlang.org/docs/handbook/classes.html))
```typescript
class ExampleClass {
    private _value: string;

    get value() : string {
        return this._value;
    }

    set value(newValue: string) {
        this._value = newValue;
    }
}
```

- Name methods with a `camelCase` style:
```typescript
class MyClass {
    myMethod() : void {

    }
}
```

- Name classes in style `ClassName`

- Use `private`, `protected`, `public` keywords to control methods and members visibility

- Use `export` keyword with class definition when export it from module:
```typescript
export class MyExportedClass {

}
```

- Do not export classes from module, if they use only in the last one