use std::panic;

use internment::LocalIntern;
use spwn::{
    builtins::BUILTIN_NAMES,
    errors::{create_report, ErrorReport},
    parse_spwn,
    shared::SpwnSource,
    SpwnCache,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn init_panics() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}

fn js_array(values: Vec<String>) -> JsValue {
    JsValue::from(
        values
            .into_iter()
            .map(|x| JsValue::from_str(&x))
            .collect::<js_sys::Array>(),
    )
}

#[wasm_bindgen]
pub fn run_spwn(code: &str, optimize: bool) -> JsValue {
    let output = spwn::run_spwn(code.to_string(), Vec::new(), optimize);
    js_array(match output {
        Ok(a) => vec![a[0].clone(), a[1].clone(), "success".to_string()],
        Err(e) => vec![e, String::new(), "error".to_string()],
    })
}

#[wasm_bindgen]
pub fn check_syntax(code: &str) -> JsValue {
    let source = SpwnSource::String(LocalIntern::new(code.to_string()));
    let cache = SpwnCache::default();
    match parse_spwn(code.to_string(), source, BUILTIN_NAMES) {
        Ok(_) => JsValue::from_str(""), 
        Err(e) => {
            let mut out = Vec::<u8>::new();
            create_report(ErrorReport::from(e))
                .write(cache, &mut out)
                .unwrap();
            return JsValue::from_str(&String::from_utf8_lossy(&out).to_string());
        }
    }
}

// #[wasm_bindgen]
// extern "C" {
//     pub fn alert(s: &str);
// }

// #[wasm_bindgen]
// pub fn greet(name: &str) {
//     unsafe {
//         alert(&format!("Hello, {}!", name));
//     }
// }
