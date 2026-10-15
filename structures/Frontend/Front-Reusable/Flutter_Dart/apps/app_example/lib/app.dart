import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'features/example/presentation/example_page.dart';

/// Rotas do app.
///
/// Cada feature registra a sua rota aqui (ou em um arquivo em `lib/routing/`).
final _router = GoRouter(
  routes: <RouteBase>[
    GoRoute(
      path: '/',
      builder: (_, __) => const ExamplePage(),
    ),
  ],
);

/// Widget raiz do app: tema (design system) + roteador.
class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'app_example',
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      routerConfig: _router,
    );
  }
}
