import { quicktype, InputData, jsonInputForTargetLanguage } from "quicktype-core";

export async function jsonToTs(
  jsonString: string,
  typeName: string = "Root"
): Promise<string> {
  const jsonInput = jsonInputForTargetLanguage("typescript");

  // quicktype에 전달하기 전에 잠재적인 JSON 파싱 오류를 처리해야 합니다.
  // quicktype이 내부적으로 처리하긴 하지만, 추후에 래핑하는 것이 좋을 수 있습니다.
  // 지금은 일단 직접 전달합니다.
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const { lines } = await quicktype({
    inputData,
    lang: "typescript",
    rendererOptions: {
      "just-types": "true", // 인터페이스/타입만 생성하고 런타임 코드는 생성하지 않음
      "explicit-unions": "true",
    },
  });

  return lines.join("\n");
}
