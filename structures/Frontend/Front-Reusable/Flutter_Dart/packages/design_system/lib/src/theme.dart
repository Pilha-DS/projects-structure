import 'package:flutter/material.dart';

/// Tema base do ecossistema.
///
/// Ponto único de verdade para cores e tipografia — os apps não devem
/// declarar `ThemeData` próprios.
abstract final class AppTheme {
  /// Cor semente usada para derivar a paleta (Material 3).
  static const Color seed = Color(0xFF3F51B5);

  /// Tema claro padrão dos apps.
  static ThemeData get light => ThemeData(
        colorSchemeSeed: seed,
        useMaterial3: true,
      );

  /// Tema escuro padrão dos apps.
  static ThemeData get dark => ThemeData(
        colorSchemeSeed: seed,
        brightness: Brightness.dark,
        useMaterial3: true,
      );
}
