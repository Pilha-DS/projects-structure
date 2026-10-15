import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app.dart';

/// Ponto de entrada do app.
///
/// `ProviderScope` habilita o Riverpod em toda a árvore de widgets.
void main() {
  runApp(const ProviderScope(child: App()));
}
